# Backend deployment on Vercel

## Vercel project settings

Create a separate Vercel project for this backend and connect it to the same GitHub repository as the frontend:

- **Root Directory:** `server`
- **Framework Preset:** Express
- **Build Command:** use the Express preset default; no custom build command is required
- **Output Directory:** leave unset
- **Node.js Version:** use a currently supported version (Vercel currently defaults to Node.js 26.x)

Vercel recognizes `src/app.js` as the Express application entry point and forwards requests through the app's existing `/api` routes. No `api/index.js` or `vercel.json` rewrite is needed. The local listener in `src/server.js` remains for development.

The `postinstall` script in `package.json` runs `prisma generate`. Set the backend environment variables before the first deployment: `prisma.config.ts` reads `DATABASE_URL` while loading Prisma configuration, including during generation. Client generation itself does not connect to PostgreSQL.

## Backend environment variables

Add these in the **backend Vercel project** under **Settings → Environment Variables**. Configure Production and Preview values separately when they use different resources/domains. Do not put backend secrets in the frontend project or in any `VITE_` variable.

| Variable | Vercel type | Configuration |
| --- | --- | --- |
| `DATABASE_URL` | Secret | Use the Neon connection string for the backend environment. For Vercel runtime traffic, use Neon's pooled endpoint (hostname includes `-pooler`) and preserve the connection parameters supplied by Neon. Use a separate Neon branch/database for Preview deployments rather than pointing previews at production data. |
| `JWT_SECRET` | Secret | Set a unique, high-entropy signing secret. Do not reuse it for another application. |
| `GROQ_API_KEY` | Secret | Set the key for the Groq account used by this backend. |
| `FRONTEND_URL` | Config | Set the exact frontend origin, including `https://` and without a path, for example `https://your-frontend-project.vercel.app`. Set the matching frontend origin for Preview deployments as well. |

Vercel stores environment variables outside the repository. Changes apply to new deployments. Never paste secret values into source files, documentation, build logs, or client-side variables.

Locally, copy `.env.example` to `.env` and replace its placeholders. The repository `.gitignore` excludes `.env` files while allowing `.env.example`.

## Prisma and Neon notes

The schema's custom client output is `src/generated`, and application code imports that generated client through `src/lib/prisma.js`. The shared client uses Prisma's PostgreSQL driver adapter (`PrismaPg`) with the runtime `DATABASE_URL`.

The Prisma CLI config also reads `DATABASE_URL`. Prisma's Neon guidance recommends a pooled URL for serverless application traffic and a direct URL for CLI operations that require direct database access. This project does not configure or run production migrations during Vercel installation/build; `postinstall` only generates the client. Do not add a migration command to the build.

`VERCEL_ENV` is used to apply the configured frontend origin in Production, Preview, and other non-development Vercel environments. Local development allows HTTP origins on `localhost` and `127.0.0.1`. Ensure Vercel system environment variables are enabled so `VERCEL_ENV` is available.
