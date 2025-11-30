SkillEdge Server (Express + Mongoose)

Quick start
1. Copy `.env.example` to `.env` and update `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```powershell
cd server
npm install
```

3. Start server in dev mode:

```powershell
npm run dev
```

API endpoints
- `POST /api/auth/register` { name, password }
- `POST /api/auth/login` { name, password }
- `GET /api/courses`
- `GET /api/courses/:slug`
- `POST /api/courses/seed-demo` (create demo course)
- `POST /api/sync` { name, path, changes }

Notes
- This is a minimal demo server for local development. For production, add validation, authentication middleware, and secure storage.
