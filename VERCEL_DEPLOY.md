# Vercel Deployment Guide

## Architecture Overview

This project uses a **hybrid Vercel deployment** with:
- **Frontend**: Static Vite/React application served from `public/` directory
- **Backend**: Fastify API deployed as serverless functions in `api/` directory

## Deployment Structure

### 1. Static Frontend
- **Source**: `frontend/` directory (Vite/React app)
- **Build Output**: `frontend/dist/`
- **Deployed To**: `public/` directory (copied during build)
- **Served By**: Vercel's static file serving

### 2. Serverless Backend
- **Source**: `src/` directory (Fastify application)
- **Entrypoint**: `api/[...path].ts` (Vercel serverless function)
- **Build Output**: `dist/` directory (TypeScript compilation)
- **Served By**: Vercel serverless functions

## Build Process

The build happens in sequence via the root `package.json` build script:

```bash
npm run build
```

This executes:
1. **`prisma generate`** - Generates Prisma Client
2. **`tsc -p tsconfig.json`** - Compiles backend TypeScript to `dist/`
3. **`npm run build:frontend`** - Builds frontend (`cd frontend && npm run build`)
4. **`npm run copy:frontend`** - Copies `frontend/dist/` to `public/`

## Configuration Files

### vercel.json

```json
{
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "rewrites": [
    // API routes are rewritten to serverless function
    { "source": "/v1/:path*", "destination": "/api/v1/:path*" },
    { "source": "/auth/:path*", "destination": "/api/auth/:path*" },
    { "source": "/health", "destination": "/api/health" },
    { "source": "/ready", "destination": "/api/ready" },
    { "source": "/docs/:path*", "destination": "/api/docs/:path*" },
    // All other routes serve the SPA
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Serverless Function Handler (api/[...path].ts)

The serverless function:
1. Creates/reuses a Fastify app instance (cached between invocations)
2. Strips the `/api` prefix from incoming URLs
3. Forwards requests to Fastify using `fastify.inject()`
4. Returns responses in Vercel-compatible format

## How Routing Works

1. **Frontend Routes** (e.g., `/`, `/about`, `/bible`)
   - Served from `public/index.html` (SPA routing)
   - Client-side React Router handles navigation

2. **API Routes** (e.g., `/v1/versions`, `/auth/login`)
   - Rewritten to `/api/v1/versions`, `/api/auth/login`
   - Handled by serverless function at `api/[...path].ts`
   - Function strips `/api` prefix and forwards to Fastify
   - Fastify routes handle the actual logic

3. **Static Assets** (e.g., `/assets/main.js`)
   - Served directly from `public/assets/`

## Environment Variables

Required environment variables on Vercel:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_REFRESH_SECRET` - Secret key for refresh token signing
- `CORS_ORIGIN` - Allowed CORS origins (optional, defaults to `*`)

## Deployment Commands

### Deploy to Production
```bash
vercel --prod
```

### Deploy to Preview
```bash
vercel
```

### Check Build Locally
```bash
npm run build
```

## Troubleshooting

### "No entrypoint found" Error
- **Cause**: Vercel couldn't find the serverless function or static files
- **Solution**: Ensure `api/[...path].ts` exists and `public/` directory is created during build

### API Routes Return 404
- **Cause**: Rewrites not properly configured or serverless function error
- **Solution**: Check Vercel function logs and verify rewrites in `vercel.json`

### Static Files Not Loading
- **Cause**: Frontend build not copied to `public/` directory
- **Solution**: Verify `copy:frontend` script runs successfully

### Database Connection Errors
- **Cause**: `DATABASE_URL` not set or incorrect in Vercel environment variables
- **Solution**: Add/update `DATABASE_URL` in Vercel project settings

## Key Differences from Local Development

| Aspect | Local Development | Vercel Production |
|--------|------------------|-------------------|
| **Backend** | Standalone Fastify server | Serverless function |
| **Port** | Runs on port 4000 | N/A (serverless) |
| **Frontend** | Vite dev server on port 5173 | Static files from `public/` |
| **API URL** | `http://localhost:4000` | Same origin via rewrites |

## File Structure

```
HOLY_BIBLE/
├── api/
│   └── [...path].ts          # Serverless function entrypoint
├── src/
│   ├── app.ts                # Fastify app configuration
│   ├── routes/               # API route handlers
│   └── ...
├── frontend/
│   ├── src/                  # React application source
│   ├── dist/                 # Vite build output (gitignored)
│   └── package.json
├── dist/                     # Backend build output (gitignored)
├── public/                   # Static files for deployment (generated)
├── vercel.json               # Vercel configuration
└── package.json              # Root package with build scripts
```

## Notes

- The `public/` directory is generated during build and should not be committed to git
- Frontend and backend are built together but deployed separately (static vs serverless)
- The serverless function caches the Fastify app instance for better performance
- Cold starts may occur on the first request after inactivity
