# krai-frontend

React frontend for the krai export/import platform. Provides Google OAuth sign-in and a dashboard for managing async export/import jobs.

Part of the [krai](https://github.com/red512/krai) project.

## Directory Structure

```
krai-frontend/
├── .github/workflows/
│   ├── ci.yaml              # Build + Grype security scan
│   └── cd.yaml              # Docker build → Artifact Registry → update krai-gitops
├── public/
│   ├── index.html            # Google Identity Services script
│   └── config.js             # Runtime config (API URL, OAuth client ID)
├── src/
│   ├── App.js                # Main dashboard — export/import buttons, job list
│   ├── AuthContext.js         # Google OAuth context (sign-in, token, logout)
│   ├── JobCard.js             # Job status card component
│   ├── api.js                 # API client (dual auth: Bearer token or x-api-key)
│   ├── index.js               # Entry point — wraps App with AuthProvider
│   ├── App.css                # Dashboard styles
│   └── index.css              # Global styles
├── Dockerfile                 # Multi-stage: Node 20 build → serve on port 8080
├── entrypoint.sh              # Injects runtime env vars into config.js
└── package.json
```

## Quick Start

```bash
npm install
npm run dev       # local dev server
npm run build     # production build
npm start         # serve built app on port 8080
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `REACT_APP_API_URL` | Backend API base URL |
| `REACT_APP_API_KEY` | API key for backend auth (empty when using OAuth) |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth Client ID (enables Google Sign-In when set) |

## Auth

When `GOOGLE_CLIENT_ID` is configured, the app shows a Google Sign-In button. After sign-in, the Google ID token is sent as `Authorization: Bearer <token>` on all API calls. Without OAuth configured, the app falls back to `x-api-key` header auth.

## CI/CD

- **CI** (`ci.yaml`): Build → Grype container vulnerability scan → Slack notification on failure
- **CD** (`cd.yaml`): Build → Push to Artifact Registry (via Workload Identity Federation) → Update image tag in krai-gitops → Slack notification

## Docker

```bash
docker build -t krai-frontend .
docker run -p 8080:8080 \
  -e REACT_APP_API_URL=http://localhost:8080 \
  -e REACT_APP_GOOGLE_CLIENT_ID=your-client-id \
  krai-frontend
```

The image runs as non-root `node` user on port 8080 using `serve`.
