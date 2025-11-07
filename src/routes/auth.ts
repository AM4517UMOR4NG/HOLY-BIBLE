import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '../schemas/index.js';
import { 
  signAccessToken, 
  signRefreshToken, 
  verifyRefreshToken,
  hashPassword,
  verifyPassword 
} from '../lib/auth.js';
import { ZodError } from 'zod';

export function registerAuthRoutes(app: FastifyInstance) {
  // Register endpoint dengan validasi lengkap
  app.post('/auth/register', async (req, reply) => {
    try {
      // Validasi input
      const body = RegisterSchema.parse(req.body);

      // Cek apakah email sudah terdaftar
      const existingUser = await prisma.user.findUnique({ 
        where: { email: body.email } 
      });

      if (existingUser) {
        return reply.code(409).send({ 
          success: false,
          message: 'Email sudah terdaftar',
          errors: [{ field: 'email', message: 'Email sudah digunakan' }]
        });
      }

      // Hash password dengan bcrypt
      const hashedPassword = await hashPassword(body.password);

      // Buat user baru
      const user = await prisma.user.create({
        data: {
          email: body.email,
          name: body.name,
          hashedPassword,
          role: 'USER'
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });

      return reply.code(201).send({ 
        success: true,
        message: 'Registrasi berhasil',
        user 
      });

    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return reply.code(400).send({ 
          success: false,
          message: 'Validasi gagal',
          errors 
        });
      }

      app.log.error(error);
      return reply.code(500).send({ 
        success: false,
        message: 'Terjadi kesalahan server' 
      });
    }
  });

  // Login endpoint dengan validasi
  app.post('/auth/login', async (req, reply) => {
    try {
      // Validasi input
      const body = LoginSchema.parse(req.body);

      // Cari user berdasarkan email
      const user = await prisma.user.findUnique({ 
        where: { email: body.email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          hashedPassword: true,
          createdAt: true
        }
      });

      // Validasi user exists dan password benar
      if (!user || !user.hashedPassword) {
        return reply.code(401).send({ 
          success: false,
          message: 'Email atau password salah',
          errors: [{ field: 'credentials', message: 'Kredensial tidak valid' }]
        });
      }

      const isPasswordValid = await verifyPassword(body.password, user.hashedPassword);
      
      if (!isPasswordValid) {
        return reply.code(401).send({ 
          success: false,
          message: 'Email atau password salah',
          errors: [{ field: 'credentials', message: 'Kredensial tidak valid' }]
        });
      }

      // Buat session di database
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          token: '', // Will be updated with refresh token
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      });

      // Generate tokens
      const accessToken = signAccessToken({ 
        sub: user.id, 
        role: user.role as any 
      });

      const refreshToken = signRefreshToken({
        sub: user.id,
        sessionId: session.id,
        type: 'refresh'
      });

      // Update session dengan refresh token
      await prisma.session.update({
        where: { id: session.id },
        data: { token: refreshToken }
      });

      // Remove hashedPassword from response
      const { hashedPassword, ...userWithoutPassword } = user;

      return reply.code(200).send({ 
        success: true,
        message: 'Login berhasil',
        accessToken, 
        refreshToken, 
        user: userWithoutPassword 
      });

    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return reply.code(400).send({ 
          success: false,
          message: 'Validasi gagal',
          errors 
        });
      }

      app.log.error(error);
      return reply.code(500).send({ 
        success: false,
        message: 'Terjadi kesalahan server' 
      });
    }
  });

  // Get current user endpoint
  app.get('/auth/me', { preHandler: [app.authenticate] }, async (req, reply) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return reply.code(404).send({ 
          success: false,
          message: 'User tidak ditemukan' 
        });
      }

      return reply.code(200).send({ 
        success: true,
        user 
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ 
        success: false,
        message: 'Terjadi kesalahan server' 
      });
    }
  });

  // Refresh token endpoint
  app.post('/auth/refresh', async (req, reply) => {
    try {
      // Validasi input
      const body = RefreshTokenSchema.parse(req.body);

      // Verify refresh token
      const payload = verifyRefreshToken(body.refreshToken);

      // Cek session di database
      const session = await prisma.session.findUnique({
        where: { 
          id: payload.sessionId,
          token: body.refreshToken
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true
            }
          }
        }
      });

      if (!session) {
        return reply.code(401).send({ 
          success: false,
          message: 'Session tidak valid atau sudah kadaluarsa' 
        });
      }

      // Cek apakah session sudah expired
      if (session.expiresAt < new Date()) {
        // Hapus session yang expired
        await prisma.session.delete({ where: { id: session.id } });
        return reply.code(401).send({ 
          success: false,
          message: 'Session sudah kadaluarsa, silakan login kembali' 
        });
      }

      // Generate new access token
      const accessToken = signAccessToken({ 
        sub: session.user.id, 
        role: session.user.role as any 
      });

      return reply.code(200).send({ 
        success: true,
        message: 'Token berhasil di-refresh',
        accessToken,
        user: session.user
      });

    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return reply.code(400).send({ 
          success: false,
          message: 'Validasi gagal',
          errors 
        });
      }

      app.log.error(error);
      return reply.code(401).send({ 
        success: false,
        message: 'Refresh token tidak valid' 
      });
    }
  });

  // Logout endpoint
  app.post('/auth/logout', { preHandler: [app.authenticate] }, async (req, reply) => {
    try {
      const body = req.body as { refreshToken?: string };

      if (body.refreshToken) {
        // Hapus session dari database
        await prisma.session.deleteMany({
          where: {
            userId: req.user!.id,
            token: body.refreshToken
          }
        });
      }

      return reply.code(200).send({ 
        success: true,
        message: 'Logout berhasil' 
      });

    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ 
        success: false,
        message: 'Terjadi kesalahan server' 
      });
    }
  });
}


