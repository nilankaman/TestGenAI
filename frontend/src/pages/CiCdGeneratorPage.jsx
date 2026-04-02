import React, { useState } from "react";
import s from "./CiCdGeneratorPage.module.css";

// Templates for each framework — written as a real developer would write them
const TEMPLATES = {
  selenium: (opts) => `name: Selenium Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      ${
        opts.db
          ? `postgres:
        image: postgres:15
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
        ports:
          - 5432:5432
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5`
          : ""
      }

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Cache Maven dependencies
        uses: actions/cache@v3
        with:
          path: ~/.m2
          key: \${{ runner.os }}-m2-\${{ hashFiles('**/pom.xml') }}

      - name: Install Chrome
        uses: browser-actions/setup-chrome@latest

      - name: Run Selenium tests
        run: mvn test -Dtest=${opts.testClass || "LoginTest,CheckoutTest"}
        env:
          BASE_URL: \${{ secrets.BASE_URL }}
          HEADLESS: true
          ${opts.db ? "DB_URL: jdbc:postgresql://localhost:5432/testdb" : ""}

      - name: Upload Surefire reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: surefire-reports
          path: target/surefire-reports/`,

  cypress: (opts) => `name: Cypress E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Start app
        run: npm run dev &
        env:
          CI: true

      - name: Wait for app to be ready
        run: npx wait-on http://localhost:${opts.port || 3000} --timeout 30000

      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          wait-on: 'http://localhost:${opts.port || 3000}'
          browser: chrome
        env:
          CYPRESS_BASE_URL: http://localhost:${opts.port || 3000}

      - name: Upload screenshots on failure
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots`,

  playwright: (opts) => `name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: \${{ secrets.BASE_URL || 'http://localhost:${opts.port || 3000}' }}

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/`,

  pytest: (opts) => `name: Pytest Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-html pytest-cov

      - name: Run tests
        run: pytest ${opts.testDir || "tests/"} -v --html=report.html --cov=. --cov-report=xml
        env:
          BASE_URL: \${{ secrets.BASE_URL }}
          API_KEY:  \${{ secrets.API_KEY }}

      - name: Upload pytest report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: pytest-report
          path: report.html`,

  junit5: (opts) => `name: JUnit5 Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Cache Maven dependencies
        uses: actions/cache@v3
        with:
          path: ~/.m2
          key: \${{ runner.os }}-m2-\${{ hashFiles('**/pom.xml') }}

      - name: Run tests
        run: mvn test
        env:
          BASE_URL: \${{ secrets.BASE_URL }}

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: target/surefire-reports/`,

  restassured: (opts) => `name: RestAssured API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  api-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Cache Maven dependencies
        uses: actions/cache@v3
        with:
          path: ~/.m2
          key: \${{ runner.os }}-m2-\${{ hashFiles('**/pom.xml') }}

      - name: Run API tests
        run: mvn test -Dtest=**/*ApiTest
        env:
          API_BASE_URL: \${{ secrets.API_BASE_URL }}
          API_KEY:      \${{ secrets.API_KEY }}
          AUTH_TOKEN:   \${{ secrets.AUTH_TOKEN }}

      - name: Upload reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: api-test-reports
          path: target/surefire-reports/`,
};

const FRAMEWORKS = [
  { id: "selenium", label: "Selenium", lang: "Java" },
  { id: "cypress", label: "Cypress", lang: "JS" },
  { id: "playwright", label: "Playwright", lang: "TS" },
  { id: "pytest", label: "Pytest", lang: "Python" },
  { id: "junit5", label: "JUnit5", lang: "Java" },
  { id: "restassured", label: "RestAssured", lang: "Java" },
];

export default function CiCdGeneratorPage() {
  const [framework, setFramework] = useState("selenium");
  const [port, setPort] = useState("3000");
  const [testClass, setTestClass] = useState("");
  const [testDir, setTestDir] = useState("tests/");
  const [includeDb, setIncludeDb] = useState(false);
  const [copied, setCopied] = useState(false);

  const opts = { port, testClass, testDir, db: includeDb };
  const generator = TEMPLATES[framework];
  const yaml = generator ? generator(opts) : "";

  function copy() {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function download() {
    const blob = new Blob([yaml], { type: "text/yaml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${framework}-tests.yml`;
    link.click();
  }

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>GitHub Actions Generator</h1>
          <p className={s.sub}>
            Generate a ready-to-use CI/CD workflow file for your test framework
          </p>
        </div>
        <div className={s.headerBadge}>🔄 CI/CD</div>
      </div>

      <div className={s.layout}>
        {/* Left — options */}
        <div className={s.left}>
          <div className={s.section}>
            <label className={s.sectionLabel}>Framework</label>
            <div className={s.fwGrid}>
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  className={`${s.fwBtn} ${framework === fw.id ? s.fwBtnOn : ""}`}
                  onClick={() => setFramework(fw.id)}
                >
                  <span className={s.fwName}>{fw.label}</span>
                  <span className={s.fwLang}>{fw.lang}</span>
                </button>
              ))}
            </div>
          </div>

          {(framework === "cypress" || framework === "playwright") && (
            <div className={s.section}>
              <label className={s.sectionLabel}>App port</label>
              <input
                className={s.input}
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="3000"
              />
              <p className={s.hint}>Port your dev server runs on</p>
            </div>
          )}

          {framework === "selenium" && (
            <div className={s.section}>
              <label className={s.sectionLabel}>Test classes to run</label>
              <input
                className={s.input}
                value={testClass}
                onChange={(e) => setTestClass(e.target.value)}
                placeholder="LoginTest,CheckoutTest"
              />
              <p className={s.hint}>Comma-separated class names</p>
            </div>
          )}

          {framework === "pytest" && (
            <div className={s.section}>
              <label className={s.sectionLabel}>Test directory</label>
              <input
                className={s.input}
                value={testDir}
                onChange={(e) => setTestDir(e.target.value)}
                placeholder="tests/"
              />
            </div>
          )}

          {(framework === "selenium" ||
            framework === "junit5" ||
            framework === "restassured") && (
            <div className={s.section}>
              <label className={s.checkboxRow}>
                <input
                  type="checkbox"
                  checked={includeDb}
                  onChange={(e) => setIncludeDb(e.target.checked)}
                  className={s.checkbox}
                />
                <span className={s.checkboxLabel}>
                  Include PostgreSQL service
                </span>
              </label>
              <p className={s.hint}>
                Adds a Postgres container for integration tests
              </p>
            </div>
          )}

          <div className={s.howTo}>
            <p className={s.howToTitle}>How to use this file</p>
            <ol className={s.steps}>
              <li>Download the YAML file below</li>
              <li>
                Create <code>.github/workflows/</code> folder in your repo
              </li>
              <li>Drop the file inside that folder</li>
              <li>Commit and push — GitHub Actions runs automatically</li>
              <li>
                Add your secrets in <code>Repo → Settings → Secrets</code>
              </li>
            </ol>
          </div>
        </div>

        {/* Right — generated YAML */}
        <div className={s.right}>
          <div className={s.outputHeader}>
            <div>
              <p className={s.outputTitle}>{framework}-tests.yml</p>
              <p className={s.outputMeta}>
                {yaml.split("\n").length} lines · GitHub Actions workflow
              </p>
            </div>
            <div className={s.outputActions}>
              <button
                className={`${s.copyBtn} ${copied ? s.copyBtnDone : ""}`}
                onClick={copy}
              >
                {copied ? " Copied" : "⎘ Copy"}
              </button>
              <button className={s.downloadBtn} onClick={download}>
                ⬇ Download
              </button>
            </div>
          </div>

          <pre className={s.yaml}>
            <code>{yaml}</code>
          </pre>

          <div className={s.secretsNote}>
            <p className={s.secretsTitle}>Secrets to add in GitHub</p>
            <div className={s.secretsList}>
              {framework === "pytest" || framework === "restassured"
                ? ["BASE_URL", "API_KEY", "AUTH_TOKEN"].map((sec) => (
                    <span key={sec} className={s.secretTag}>
                      {sec}
                    </span>
                  ))
                : ["BASE_URL"].map((sec) => (
                    <span key={sec} className={s.secretTag}>
                      {sec}
                    </span>
                  ))}
            </div>
            <p className={s.secretsHint}>
              Go to your repo → Settings → Secrets and variables → Actions → New
              repository secret
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
