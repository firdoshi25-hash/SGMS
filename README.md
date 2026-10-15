# Student Growth & Management System

SGMS uses a React/Vite client, an Express API, and MongoDB. The client and API run as separate processes.

## Requirements

- Node.js 22 or newer
- MongoDB Atlas, a local MongoDB server, or Docker Compose

## Configure MongoDB and the API

From the project root, create a local environment file without overwriting an existing one:

```bash
cp -n server/.env.example server/.env
```

Edit `server/.env` and set `MONGO_URI` to your MongoDB connection string. `MONGODB_URI` is also accepted for compatibility with existing environment files. For local MongoDB, the example URI works with the optional Compose service below. For Atlas, use the URI from your cluster and allow your development IP in Atlas Network Access.

Generate a signing secret:

```bash
node -e "process.stdout.write(require('node:crypto').randomBytes(48).toString('hex') + '\n')"
```

Put the generated value in `JWT_SECRET`. Keep `.env` private; never commit it or put real values in `.env.example`. Set `CLIENT_ORIGIN` to the exact client origin, normally `http://localhost:5173`.

Optional local MongoDB using Docker:

```bash
docker compose up -d mongo
```

Docker is optional. Without Docker or a reachable Atlas cluster, the API will stop at startup with a clear MongoDB configuration error.

## Install and run

Terminal 1, API:

```bash
cd server
npm install
npm run dev
```

Terminal 2, client:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite development server proxies `/api` requests to `http://localhost:5000`. The API health check is `http://localhost:5000/api/health`.

## First administrator

Set `ADMIN_EMAIL` and an `ADMIN_PASSWORD` of at least 12 characters in `server/.env`, then run once:

```bash
cd server
npm run create:admin
```

This command creates a new admin account only; it will not promote or overwrite an existing account. New registrations receive the student role.

## Available workflows

- Register, sign in, restore a session, and sign out using an HttpOnly cookie.
- Create, read, update, and delete user-owned goals, tasks, study sessions, attendance, notes, projects, leave requests, and notifications.
- Record Pomodoro timer completions as study sessions.
- View dashboard and report aggregates from saved records.
- Update profile and preferences. Admins can list accounts and review leave requests.

The API enforces authentication and record ownership. Student leave requests always start as pending; only an admin can approve or reject them.

## Checks

```bash
cd server && npm test && npm audit
cd ../client && npm run lint && npm run build
```

For a deployed client/API on different origins, set `VITE_API_URL` when building the client and set `CLIENT_ORIGIN` on the server. Use HTTPS in production so the secure authentication cookie is enabled.

## Deploy to Render

The repository includes a Render Blueprint in `render.yaml`. After pushing the repository to GitHub:

1. In Render, choose **New + → Blueprint** and connect `firdoshi25-hash/SWMS`.
2. Review the two services, `sgms-api-firdoshi` and `sgms-web-firdoshi`.
3. When prompted, enter `MONGO_URI` as a secret using your MongoDB Atlas connection string. The Blueprint generates `JWT_SECRET` privately.
4. Deploy the Blueprint and wait for the API health check to pass before testing the static site.

The Blueprint configures the API CORS origin and frontend API URL for those service names, plus an SPA rewrite so direct page URLs work. The database URI is never stored in Git. Configure Atlas Network Access to allow connections from your Render service; avoid opening database access to every IP unless you understand and accept that security tradeoff.