# 🧪 TestGen AI
**Bridging the gap between Requirements and Quality Assurance.**

TestGen AI is an intelligent full-stack platform designed to eliminate the manual bottleneck in QA. By translating plain English feature descriptions into structured manual test cases and production-ready automation scripts, it allows teams to go from "Idea" to "Execution" in seconds.

---

### 🚀 Key Features

* **🔐 Secure Access:** JWT-based authentication with Spring Security and a "One-Click" Demo mode for instant exploration.
* **📋 Intelligent Generation:** * **Manual Cases:** Structured, step-by-step instructions.
    * **Automation:** Instant scripts for **Selenium, Cypress, and Playwright**.
    * **Script-to-Script:** Refine or convert existing code using LLM logic.
* **🗂 Project Workspace:** Organized project management with full generation history and persistent storage.
* **💬 AI QA Assistant:** A dedicated Groq-powered chat proxy for real-time debugging and strategy.
* **🧪 Built-in Quality:** Fully covered by Cypress E2E tests for login, generation flows, and framework selection.

---

### 🏗 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot, Spring Security (JWT), Maven |
| **Frontend** | React (Vite), React Router, CSS Modules |
| **Database** | PostgreSQL 16 |
| **AI Engine** | Groq API (LLM) |
| **E2E Testing** | Cypress |

---

### 📦 Prerequisites

* **Java 17** (Strictly required; Lombok may break on newer versions)
* **Maven 3.9+**
* **PostgreSQL 16**
* **Node.js 18+**
* **Groq API Key** (Free tier supported)

---

### ⚙️ Installation & Setup

**1. Clone & Database**
```bash
git clone <your-repo-url>
cd TestGenAI
psql -U postgres -f setup.sql
```

**2. Configure Secrets**
Add your credentials to `backend/src/main/resources/application.properties`:
```properties
groq.api.key=YOUR_API_KEY_HERE
```

**3. Launch Services**
* **Backend:** Run `.\start-backend.ps1` (Default: `http://localhost:8081`)
* **Frontend:** ```bash
    cd frontend
    npm install
    npm run dev  # (Default: http://localhost:5173)
    ```

---

### 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service status check |
| `POST` | `/api/v1/generate` | Generate test cases/scripts |
| `GET` | `/api/v1/projects` | Fetch all user projects |
| `POST` | `/api/chat` | AI chat proxy endpoint |

---

### 🛠 Troubleshooting

* **Lombok/Java Errors:** Ensure `JAVA_HOME` points to JDK 17.
* **Port Conflicts:** If `8081` is busy, kill the process via `netstat -ano | findstr :8081`.
* **Plan Limits:** The free tier includes **3 shares/day** with a 6-hour cooldown.

---

### 🎯 Project Purpose
TestGen AI serves as a comprehensive showcase of **Production-Style Architecture**, demonstrating the seamless integration of **Spring Boot security**, **AI-driven logic**, and **E2E testing best practices**.
