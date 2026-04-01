# 🧪 TestGen AI

AI-powered test case generator. Describe a feature → choose a framework → get production-ready test code in seconds.

---

## Prerequisites

| Tool | Version | Note |
|------|---------|------|
| Java JDK | **17 only** | NOT 21 or 24 — Lombok breaks on newer versions |
| Maven | 3.9+ | |
| PostgreSQL | 16 | Must be running before the backend starts |
| Node.js | 18+ | |
| Groq API key | Free | https://console.groq.com |

---

## Setup (one time)

**1. Create the database**

```powershell
psql -U postgres -f setup.sql
```

**2. Add your Groq API key**

Open `backend\src\main\resources\application.properties` and replace:
```

---

## Start the app

**Terminal 1 — Backend**
```powershell
.\start-backend.ps1
```
Backend runs at http://localhost:8081

Verify: `curl http://localhost:8081/api/health`

**Terminal 2 — Frontend**
```powershell
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

**Login:** Click "Try demo" on the login page — no account needed.

---

## Common errors

**Lombok annotation errors**
You are on the wrong Java version. Fix:
```powershell
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
```

**Port 8081 already in use**
```powershell
netstat -ano | findstr :8081
taskkill /PID <number> /F
```

**Database connection failed**
Make sure PostgreSQL is running and the credentials in `application.properties` match what you created in `setup.sql`.

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Sign in, get JWT |
| POST | /api/v1/generate | Generate test cases |
| GET | /api/v1/generate/history | Past generations |
| GET | /api/v1/projects | List projects |
| POST | /api/v1/projects | Create project |
| DELETE | /api/v1/projects/{id} | Delete project |
| POST | /api/chat | AI Chat proxy |

---

## Share limits (free plan)

- 3 shares per day
- 6-hour cooldown between shares
- Counter resets at midnight (local time)
- Upgrade on the `/subscription` page to remove all limits

---
