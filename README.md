# Full-Stack MVP Monorepo (Expo + Next.js + Prisma)

## Folder Structure

```txt
/apps
  /mobile     # Expo + React Native app
  /web        # Next.js API backend (App Router)
/packages
  /shared     # Shared TypeScript types and validation helpers
```

## Tech Stack

- **Mobile**: Expo (React Native), TypeScript, Expo Router, Axios, Zustand
- **Backend**: Next.js (App Router API routes), TypeScript, Prisma, PostgreSQL
- **Security**: JWT auth, bcrypt password hashing, route protection middleware
- **Validation**: zod

## MVP Features

- Register + Login
- JWT authentication
- Task CRUD (scoped per user)
- Secure token storage in mobile via AsyncStorage

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment variables

Copy `.env.example` to `.env` and update values.

```bash
cp .env.example .env
```

## 3) Database setup (Prisma)

```bash
npm --workspace apps/web run prisma:generate
npm --workspace apps/web run prisma:migrate
```

## 4) Run backend

```bash
npm run dev:web
```

Backend APIs will be available at `http://localhost:3000/api`.

## 5) Run mobile app

```bash
npm run dev:mobile
```

Use Expo Go or simulator to open the app.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Notes

- Middleware protects `/api/tasks*` routes by requiring a Bearer token.
- Prisma schema defines `User` and `Task` with a one-to-many relation.
- Shared DTOs live in `packages/shared` for future web/mobile consistency.
