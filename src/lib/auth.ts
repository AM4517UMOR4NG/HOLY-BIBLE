import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secret = process.env.JWT_PRIVATE_KEY || 'dev_secret_change_me';
const accessTokenExpiry = process.env.JWT_EXPIRES_IN || '1h';
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRES || '30d';

export interface JwtPayload {
  sub: string;
  role: 'USER' | 'EDITOR' | 'ADMIN';
}

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
  type: 'refresh';
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function signAccessToken(payload: JwtPayload, expiresIn: string | number = accessTokenExpiry) {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, secret, { expiresIn: refreshTokenExpiry } as SignOptions);
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, secret) as RefreshTokenPayload;
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  return decoded;
}


