import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string()
    .email({ message: 'Format email tidak valid' })
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, { message: 'Password minimal 8 karakter' })
    .max(100, { message: 'Password maksimal 100 karakter' })
    .regex(/[A-Z]/, { message: 'Password harus mengandung minimal 1 huruf kapital' })
    .regex(/[a-z]/, { message: 'Password harus mengandung minimal 1 huruf kecil' })
    .regex(/[0-9]/, { message: 'Password harus mengandung minimal 1 angka' }),
  name: z.string()
    .min(2, { message: 'Nama minimal 2 karakter' })
    .max(100, { message: 'Nama maksimal 100 karakter' })
    .trim()
});

export const LoginSchema = z.object({
  email: z.string()
    .email({ message: 'Format email tidak valid' })
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, { message: 'Password harus diisi' })
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token harus diisi' })
});

export const AnnotationCreateSchema = z.object({
  verseId: z.string(),
  content: z.string().min(1),
  rangeStart: z.number().int().optional(),
  rangeEnd: z.number().int().optional()
});

export const BookmarkCreateSchema = z.object({
  verseId: z.string(),
  name: z.string().optional()
});

export const ImportJSONSchema = z.object({
  versionCode: z.string(),
  title: z.string().default(''),
  language: z.string().default('und'),
  description: z.string().optional(),
  books: z.array(z.object({
    name: z.string(),
    order: z.number().int(),
    chapters: z.array(z.object({
      number: z.number().int(),
      verses: z.array(z.object({
        number: z.number().int(),
        text: z.string()
      }))
    }))
  }))
});


