import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

const TYPED_WORDS = [
  "Unit Tests",
  "Integration Tests",
  "E2E Tests",
  "API Tests",
  "Regression Tests",
  "Smoke Tests",
];

const STATS = [
  { value: "10x", label: "Faster test writing", icon: "⚡" },
  { value: "99%", label: "Coverage confidence", icon: "✅" },
  { value: "5+", label: "Frameworks supported", icon: "🔧" },
  { value: "∞", label: "Test cases possible", icon: "🧪" },
];

const FEATURES = [
  {
    icon: "🤖",
    title: "AI-Powered Generation",
    desc: "Describe your feature in plain English and get production-ready test cases in seconds. No boilerplate, no guesswork.",
    tag: "Core",
  },
  {
    icon: "🎯",
    title: "Multi-Framework Support",
    desc: "Outputs for Selenium, Appium, RestAssured, Cucumber, JUnit, TestNG, Cypress, and Playwright — your stack, your rules.",
    tag: "Flexible",
  },
  {
    icon: "📊",
    title: "Full Coverage Types",
    desc: "Happy path, edge cases, negative scenarios, boundary values — one click generates every angle your QA brain would think of.",
    tag: "Thorough",
  },
  {
    icon: "🔗",
    title: "Jira & Confluence Ready",
    desc: "Link issues directly, pull requirements from docs, and push test cases back to your project management tools.",
    tag: "Integrated",
  },
  {
    icon: "🔄",
    title: "CI/CD Pipeline Integration",
    desc: "Monitor your test runs, trigger pipelines, and track pass/fail directly from your TestGen dashboard.",
    tag: "DevOps",
  },
  {
    icon: "📜",
    title: "Full History & Projects",
    desc: "Every test case you've ever generated is saved, searchable, and organized by project. Never lose work again.",
    tag: "Organized",
  },
];

const PYRAMID_LAYERS = [
  {
    label: "E2E Tests",
    width: "40%",
    color: "#f87171",
    desc: "Slow · Expensive · High Confidence",
  },
  {
    label: "Integration Tests",
    width: "65%",
    color: "#fb923c",
    desc: "Medium Speed · Medium Cost",
  },
  {
    label: "Unit Tests",
    width: "100%",
    color: "#4ade80",
    desc: "Fast · Cheap · Build the Base",
  },
];

const QUOTES = [
  {
    text: "Testing leads to failure, and failure leads to understanding.",
    author: "Burt Rutan",
  },
  {
    text: "Quality is never an accident; it is always the result of intelligent effort.",
    author: "John Ruskin",
  },
  {
    text: "If debugging is the process of removing bugs, then programming must be the process of putting them in.",
    author: "Edsger W. Dijkstra",
  },
];

const FRAMEWORKS = [
  {
    name: "Selenium",
    icon: "🌐",
    type: "Web UI Testing",
    summary:
      "The industry standard for browser automation. Selenium controls real browsers like Chrome, Firefox, and Edge to simulate user interactions — clicking buttons, filling forms, navigating pages.",
    usedFor: "Web UI regression testing, cross-browser compatibility",
    url: "https://www.selenium.dev",
  },
  {
    name: "Appium",
    icon: "📱",
    type: "Mobile Testing",
    summary:
      "Appium automates native, hybrid, and mobile web apps on Android and iOS. It uses the WebDriver protocol, so if you know Selenium, Appium feels familiar.",
    usedFor: "Mobile app automation on Android & iOS",
    url: "https://appium.io",
  },
  {
    name: "RestAssured",
    icon: "🔌",
    type: "API Testing",
    summary:
      "A Java library that makes writing REST API tests feel like writing plain English. Validates status codes, response bodies, headers, and authentication flows effortlessly.",
    usedFor: "REST API validation, contract testing",
    url: "https://rest-assured.io",
  },
  {
    name: "Cucumber",
    icon: "🥒",
    type: "BDD Framework",
    summary:
      "Bridges the gap between business and engineering using Gherkin syntax (Given / When / Then). Tests are written in plain English, making them readable by non-technical stakeholders.",
    usedFor: "Behaviour-Driven Development, acceptance testing",
    url: "https://cucumber.io",
  },
  {
    name: "Cypress",
    icon: "⚡",
    type: "Modern Web Testing",
    summary:
      "A next-generation front-end testing tool built for the modern web. Runs directly in the browser, gives real-time feedback, and handles async UI flawlessly.",
    usedFor: "Component testing, E2E web testing, fast CI runs",
    url: "https://www.cypress.io",
  },
  {
    name: "Playwright",
    icon: "🎭",
    type: "Cross-Browser E2E",
    summary:
      "Microsoft's powerful automation library that supports Chromium, Firefox, and WebKit in one API. Handles modern SPAs, shadow DOM, file downloads, and network interception with ease.",
    usedFor: "Cross-browser E2E testing, visual regression",
    url: "https://playwright.dev",
  },
];

// Mock users — replace with real API
const MOCK_USERS = [
  {
    id: 1,
    name: "Nilank Aman",
    email: "nilank@testgen.com",
    role: "QA Engineer",
  },
  { id: 2, name: "Priya Sharma", email: "priya@testgen.com", role: "SDET" },
  { id: 3, name: "Kenji Tanaka", email: "kenji@testgen.com", role: "QA Lead" },
  {
    id: 4,
    name: "Sara Ahmed",
    email: "sara@testgen.com",
    role: "Automation Tester",
  },
];

// ── Framework tag with tooltip ──
function FrameworkTag({ framework }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setVisible(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div
      ref={ref}
      className={styles.tagWrap}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span
        className={`${styles.heroTag} ${visible ? styles.heroTagActive : ""}`}
      >
        {framework.icon} {framework.name}
      </span>
      {visible && (
        <div className={styles.tagTooltip}>
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipIcon}>{framework.icon}</span>
            <div>
              <p className={styles.tooltipName}>{framework.name}</p>
              <span className={styles.tooltipType}>{framework.type}</span>
            </div>
          </div>
          <p className={styles.tooltipSummary}>{framework.summary}</p>
          <div className={styles.tooltipUsed}>
            <span className={styles.tooltipUsedLabel}>Used for:</span>
            <span>{framework.usedFor}</span>
          </div>
          <a
            href={framework.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.tooltipLink}
          >
            Know more →
          </a>
        </div>
      )}
    </div>
  );
}

// ── Typing effect hook ──
function useTypingEffect(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < word.length)
      timeout = setTimeout(() => setCharIdx((i) => i + 1), speed);
    else if (!deleting && charIdx === word.length)
      timeout = setTimeout(() => setDeleting(true), pause);
    else if (deleting && charIdx > 0)
      timeout = setTimeout(() => setCharIdx((i) => i - 1), speed / 2);
    else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }
    setDisplay(word.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ── Main component ──
export default function HomePage() {
  const navigate = useNavigate();
  const typed = useTypingEffect(TYPED_WORDS);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const statsRef = useRef(null);

  // User search
  const [userQuery, setUserQuery] = useState("");
  const [userFocused, setUserFocused] = useState(false);

  const userResults =
    userQuery.trim().length > 0
      ? MOCK_USERS.filter(
          (u) =>
            u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(userQuery.toLowerCase()) ||
            u.role.toLowerCase().includes(userQuery.toLowerCase()),
        )
      : [];

  const initials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  useEffect(() => {
    const t = setInterval(
      () => setQuoteIdx((i) => (i + 1) % QUOTES.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className={styles.page} data-page-scroll>
      {/* ── Animated background ── */}
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgOrb1} aria-hidden />
      <div className={styles.bgOrb2} aria-hidden />

      {/* ── Vivid colour orbs ── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div className={`${styles.colorOrb} ${styles.co1}`} />
        <div className={`${styles.colorOrb} ${styles.co2}`} />
        <div className={`${styles.colorOrb} ${styles.co3}`} />
        <div className={`${styles.colorOrb} ${styles.co4}`} />
        <div className={`${styles.colorOrb} ${styles.co5}`} />
        <div className={`${styles.colorOrb} ${styles.co6}`} />
        <div className={`${styles.colorOrb} ${styles.co7}`} />
        <div className={`${styles.colorOrb} ${styles.co8}`} />
        <div className={`${styles.glowRing} ${styles.gr1}`} />
        <div className={`${styles.glowRing} ${styles.gr2}`} />
        <div className={`${styles.glowRing} ${styles.gr3}`} />
        <div className={`${styles.glowRing} ${styles.gr4}`} />
        <div className={`${styles.glowRing} ${styles.gr5}`} />
      </div>

      {/* ── Floating decorative background elements ── */}
      <div className={styles.bgDecorations} aria-hidden>
        <div className={`${styles.floatCard} ${styles.fc1}`}>
          <div className={styles.fcDots}>
            <span />
            <span />
            <span />
          </div>
          <pre
            className={styles.fcCode}
          >{`@Test\nvoid loginTest() {\n  driver.get(baseUrl);\n  login("user","pass");\n  assert isLoggedIn();\n}`}</pre>
        </div>
        <div className={`${styles.floatCard} ${styles.fc2}`}>
          <div className={styles.fcDots}>
            <span />
            <span />
            <span />
          </div>
          <pre
            className={styles.fcCode}
          >{`Given user on login page\nWhen enters valid creds\nThen dashboard shown\nAnd welcome message visible`}</pre>
        </div>
        <div className={`${styles.floatCard} ${styles.fc3}`}>
          <div className={styles.fcDots}>
            <span />
            <span />
            <span />
          </div>
          <pre
            className={styles.fcCode}
          >{`✅ TC001 Login   PASS\n✅ TC002 Cart    PASS\n❌ TC003 Pay     FAIL\n   Expected 200 got 404\n✅ TC004 Profile PASS`}</pre>
        </div>
        <div className={`${styles.floatCard} ${styles.fc4}`}>
          <div className={styles.fcDots}>
            <span />
            <span />
            <span />
          </div>
          <pre
            className={styles.fcCode}
          >{`given()\n .baseUri(API_URL)\n .header("Auth",token)\n.when()\n .get("/users")\n.then()\n .statusCode(200);`}</pre>
        </div>
        <div className={`${styles.floatCard} ${styles.fc5}`}>
          <div className={styles.fcDots}>
            <span />
            <span />
            <span />
          </div>
          <pre
            className={styles.fcCode}
          >{`describe("Login", () => {\n  it("logs in OK", () => {\n    cy.visit("/login")\n    cy.get("#email").type(u)\n    cy.get("#pass").type(p)\n    cy.get("button").click()\n  })\n})`}</pre>
        </div>
        <div className={`${styles.floatCard} ${styles.fc6}`}>
          <div className={styles.fcDots}>
            <span />
            <span />
            <span />
          </div>
          <pre
            className={styles.fcCode}
          >{`📋 Test Plan v2.3\n━━━━━━━━━━━━━━━\nScope: Smoke+Regression\nEnv:   Staging\nBuild: 4.1.2-rc\nMode:  Manual + Auto`}</pre>
        </div>
        <div className={`${styles.floatCard} ${styles.fc7}`}>
          <div className={styles.fcDots}>
            <span />
            <span />
            <span />
          </div>
          <pre
            className={styles.fcCode}
          >{`🔒 Security Scan\n─────────────────\n✅ SQL Injection\n✅ XSS Prevention\n✅ Auth Bypass\n⏳ CSRF Token Check`}</pre>
        </div>
        <div className={`${styles.floatCard} ${styles.fc8}`}>
          <div className={styles.fcDots}>
            <span />
            <span />
            <span />
          </div>
          <pre
            className={styles.fcCode}
          >{`⚡ Load Test Results\n────────────────────\nResponse:  142ms ✅\nThroughput: 2.3k/s\nError rate: 0.01%\nP99:        380ms ✅`}</pre>
        </div>

        <div className={`${styles.floatBadge} ${styles.fb1} ${styles.fbGreen}`}>
          🐛 Bug Found &amp; Fixed
        </div>
        <div className={`${styles.floatBadge} ${styles.fb2} ${styles.fbBlue}`}>
          ✅ 94% Pass Rate
        </div>
        <div
          className={`${styles.floatBadge} ${styles.fb3} ${styles.fbPurple}`}
        >
          ⚡ CI Build Passed
        </div>
        <div
          className={`${styles.floatBadge} ${styles.fb4} ${styles.fbOrange}`}
        >
          🔁 Regression Complete
        </div>
        <div className={`${styles.floatBadge} ${styles.fb5} ${styles.fbCyan}`}>
          📊 Coverage: 87%
        </div>
        <div className={`${styles.floatBadge} ${styles.fb6} ${styles.fbPink}`}>
          🔒 Security: PASS
        </div>
        <div
          className={`${styles.floatBadge} ${styles.fb7} ${styles.fbYellow}`}
        >
          📱 Mobile Tests: OK
        </div>
        <div className={`${styles.floatBadge} ${styles.fb8} ${styles.fbGreen}`}>
          🚀 Deploy Approved
        </div>
        <div className={`${styles.floatBadge} ${styles.fb9} ${styles.fbBlue}`}>
          📋 Manual TC: 42/42
        </div>
        <div
          className={`${styles.floatBadge} ${styles.fb10} ${styles.fbPurple}`}
        >
          ⏱️ Load Test: 2.3k RPS
        </div>

        <div className={`${styles.testTypeLabel} ${styles.ttl1}`}>
          🤖 Automation Testing
        </div>
        <div className={`${styles.testTypeLabel} ${styles.ttl2}`}>
          📋 Manual Testing
        </div>
        <div className={`${styles.testTypeLabel} ${styles.ttl3}`}>
          ⚡ Performance Testing
        </div>
        <div className={`${styles.testTypeLabel} ${styles.ttl4}`}>
          🔒 Security Testing
        </div>
        <div className={`${styles.testTypeLabel} ${styles.ttl5}`}>
          📱 Mobile Testing
        </div>
        <div className={`${styles.testTypeLabel} ${styles.ttl6}`}>
          🔗 API Testing
        </div>

        <span className={`${styles.bgIcon} ${styles.bgi1}`}>🧪</span>
        <span className={`${styles.bgIcon} ${styles.bgi2}`}>🤖</span>
        <span className={`${styles.bgIcon} ${styles.bgi3}`}>🔍</span>
        <span className={`${styles.bgIcon} ${styles.bgi4}`}>⚙️</span>
        <span className={`${styles.bgIcon} ${styles.bgi5}`}>🛡️</span>
        <span className={`${styles.bgIcon} ${styles.bgi6}`}>📱</span>
        <span className={`${styles.bgIcon} ${styles.bgi7}`}>🚀</span>
        <span className={`${styles.bgIcon} ${styles.bgi8}`}>📊</span>

        {/* ── CI/CD Pipeline diagrams ── */}
        <div className={`${styles.pipelineDiagram} ${styles.pd1}`}>
          {[
            ["🔀", "blue", "Git"],
            ["⚙️", "purple", "Build"],
            ["🧪", "cyan", "Test"],
            ["🐳", "orange", "Docker"],
            ["🚀", "green", "Deploy"],
          ].map(([icon, col, lbl], i, arr) => (
            <React.Fragment key={lbl}>
              <div className={styles.pipeStep}>
                <div className={`${styles.pipeIcon} ${styles[col]}`}>
                  {icon}
                </div>
                <span className={styles.pipeLabel}>{lbl}</span>
              </div>
              {i < arr.length - 1 && (
                <span className={styles.pipeArrow}>›</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className={`${styles.pipelineDiagram} ${styles.pd2}`}>
          {[
            ["📝", "blue", "Write"],
            ["🤖", "purple", "AI Gen"],
            ["✅", "green", "Review"],
            ["📤", "orange", "Export"],
          ].map(([icon, col, lbl], i, arr) => (
            <React.Fragment key={lbl}>
              <div className={styles.pipeStep}>
                <div className={`${styles.pipeIcon} ${styles[col]}`}>
                  {icon}
                </div>
                <span className={styles.pipeLabel}>{lbl}</span>
              </div>
              {i < arr.length - 1 && (
                <span className={styles.pipeArrow}>›</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className={`${styles.pipelineDiagram} ${styles.pd3}`}>
          {[
            ["🔍", "cyan", "Scan"],
            ["🐛", "orange", "Detect"],
            ["🔧", "purple", "Fix"],
            ["✅", "green", "Pass"],
          ].map(([icon, col, lbl], i, arr) => (
            <React.Fragment key={lbl}>
              <div className={styles.pipeStep}>
                <div className={`${styles.pipeIcon} ${styles[col]}`}>
                  {icon}
                </div>
                <span className={styles.pipeLabel}>{lbl}</span>
              </div>
              {i < arr.length - 1 && (
                <span className={styles.pipeArrow}>›</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Metric bar cards ── */}
        <div className={`${styles.metricCard} ${styles.mc1}`}>
          <p className={styles.mcTitle}>Test Coverage</p>
          {[
            ["Unit Tests", "92%", "#4ade80", 92],
            ["Integration", "78%", "#60a5fa", 78],
            ["E2E Tests", "65%", "#a78bfa", 65],
          ].map(([l, v, c, w]) => (
            <div key={l} className={styles.mcRow}>
              <span className={styles.mcRowLabel}>{l}</span>
              <div className={styles.mcBar}>
                <div
                  className={styles.mcFill}
                  style={{ width: `${w}%`, background: c }}
                />
              </div>
              <span className={styles.mcVal} style={{ color: c }}>
                {v}
              </span>
            </div>
          ))}
        </div>
        <div className={`${styles.metricCard} ${styles.mc2}`}>
          <p className={styles.mcTitle}>Build Health</p>
          {[
            ["Pass Rate", "94%", "#4ade80", 94],
            ["Flaky Tests", "3%", "#fb923c", 3],
            ["Skipped", "2%", "#facc15", 2],
          ].map(([l, v, c, w]) => (
            <div key={l} className={styles.mcRow}>
              <span className={styles.mcRowLabel}>{l}</span>
              <div className={styles.mcBar}>
                <div
                  className={styles.mcFill}
                  style={{ width: `${w}%`, background: c }}
                />
              </div>
              <span className={styles.mcVal} style={{ color: c }}>
                {v}
              </span>
            </div>
          ))}
        </div>
        <div className={`${styles.metricCard} ${styles.mc3}`}>
          <p className={styles.mcTitle}>API Response</p>
          {[
            ["GET /users", "142ms", "#22d3ee", 48],
            ["POST /auth", "89ms", "#4ade80", 30],
            ["GET /tests", "310ms", "#fb923c", 100],
          ].map(([l, v, c, w]) => (
            <div key={l} className={styles.mcRow}>
              <span className={styles.mcRowLabel}>{l}</span>
              <div className={styles.mcBar}>
                <div
                  className={styles.mcFill}
                  style={{ width: `${w}%`, background: c }}
                />
              </div>
              <span className={styles.mcVal} style={{ color: c }}>
                {v}
              </span>
            </div>
          ))}
        </div>
        <div className={`${styles.metricCard} ${styles.mc4}`}>
          <p className={styles.mcTitle}>Manual Testing</p>
          {[
            ["Executed", "42/42", "#4ade80", 100],
            ["Blocked", "2/42", "#fb923c", 5],
            ["Defects", "7 open", "#f472b6", 17],
          ].map(([l, v, c, w]) => (
            <div key={l} className={styles.mcRow}>
              <span className={styles.mcRowLabel}>{l}</span>
              <div className={styles.mcBar}>
                <div
                  className={styles.mcFill}
                  style={{ width: `${w}%`, background: c }}
                />
              </div>
              <span className={styles.mcVal} style={{ color: c }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* ── Network node clusters (SVG) ── */}
        <div className={`${styles.networkCluster} ${styles.nc1}`}>
          <svg className={styles.networkSvg} viewBox="0 0 120 120">
            <line
              x1="60"
              y1="60"
              x2="20"
              y2="20"
              stroke="rgba(96,165,250,0.5)"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="60"
              x2="100"
              y2="20"
              stroke="rgba(167,139,250,0.5)"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="60"
              x2="10"
              y2="80"
              stroke="rgba(34,211,238,0.5)"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="60"
              x2="110"
              y2="80"
              stroke="rgba(244,114,182,0.5)"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="60"
              x2="60"
              y2="110"
              stroke="rgba(74,222,128,0.5)"
              strokeWidth="1"
            />
            <circle
              cx="60"
              cy="60"
              r="8"
              fill="rgba(139,92,246,0.6)"
              stroke="rgba(139,92,246,0.9)"
              strokeWidth="1.5"
            />
            <circle
              cx="20"
              cy="20"
              r="5"
              fill="rgba(96,165,250,0.5)"
              stroke="rgba(96,165,250,0.8)"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="20"
              r="5"
              fill="rgba(167,139,250,0.5)"
              stroke="rgba(167,139,250,0.8)"
              strokeWidth="1"
            />
            <circle
              cx="10"
              cy="80"
              r="5"
              fill="rgba(34,211,238,0.5)"
              stroke="rgba(34,211,238,0.8)"
              strokeWidth="1"
            />
            <circle
              cx="110"
              cy="80"
              r="5"
              fill="rgba(244,114,182,0.5)"
              stroke="rgba(244,114,182,0.8)"
              strokeWidth="1"
            />
            <circle
              cx="60"
              cy="110"
              r="5"
              fill="rgba(74,222,128,0.5)"
              stroke="rgba(74,222,128,0.8)"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div className={`${styles.networkCluster} ${styles.nc2}`}>
          <svg className={styles.networkSvg} viewBox="0 0 120 120">
            <line
              x1="30"
              y1="30"
              x2="90"
              y2="30"
              stroke="rgba(250,204,21,0.5)"
              strokeWidth="1"
            />
            <line
              x1="90"
              y1="30"
              x2="90"
              y2="90"
              stroke="rgba(251,146,60,0.5)"
              strokeWidth="1"
            />
            <line
              x1="90"
              y1="90"
              x2="30"
              y2="90"
              stroke="rgba(74,222,128,0.5)"
              strokeWidth="1"
            />
            <line
              x1="30"
              y1="90"
              x2="30"
              y2="30"
              stroke="rgba(96,165,250,0.5)"
              strokeWidth="1"
            />
            <line
              x1="30"
              y1="30"
              x2="90"
              y2="90"
              stroke="rgba(167,139,250,0.4)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <line
              x1="90"
              y1="30"
              x2="30"
              y2="90"
              stroke="rgba(244,114,182,0.4)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <circle
              cx="30"
              cy="30"
              r="6"
              fill="rgba(250,204,21,0.5)"
              stroke="rgba(250,204,21,0.9)"
              strokeWidth="1.5"
            />
            <circle
              cx="90"
              cy="30"
              r="6"
              fill="rgba(251,146,60,0.5)"
              stroke="rgba(251,146,60,0.9)"
              strokeWidth="1.5"
            />
            <circle
              cx="90"
              cy="90"
              r="6"
              fill="rgba(74,222,128,0.5)"
              stroke="rgba(74,222,128,0.9)"
              strokeWidth="1.5"
            />
            <circle
              cx="30"
              cy="90"
              r="6"
              fill="rgba(96,165,250,0.5)"
              stroke="rgba(96,165,250,0.9)"
              strokeWidth="1.5"
            />
            <circle
              cx="60"
              cy="60"
              r="5"
              fill="rgba(167,139,250,0.5)"
              stroke="rgba(167,139,250,0.9)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className={`${styles.networkCluster} ${styles.nc3}`}>
          <svg className={styles.networkSvg} viewBox="0 0 120 120">
            <line
              x1="60"
              y1="15"
              x2="100"
              y2="50"
              stroke="rgba(34,211,238,0.5)"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="15"
              x2="20"
              y2="50"
              stroke="rgba(244,114,182,0.5)"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="50"
              x2="40"
              y2="100"
              stroke="rgba(96,165,250,0.5)"
              strokeWidth="1"
            />
            <line
              x1="100"
              y1="50"
              x2="80"
              y2="100"
              stroke="rgba(74,222,128,0.5)"
              strokeWidth="1"
            />
            <line
              x1="40"
              y1="100"
              x2="80"
              y2="100"
              stroke="rgba(251,146,60,0.5)"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="15"
              x2="60"
              y2="75"
              stroke="rgba(167,139,250,0.4)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <circle
              cx="60"
              cy="15"
              r="7"
              fill="rgba(34,211,238,0.6)"
              stroke="rgba(34,211,238,0.9)"
              strokeWidth="1.5"
            />
            <circle
              cx="20"
              cy="50"
              r="5"
              fill="rgba(244,114,182,0.5)"
              stroke="rgba(244,114,182,0.8)"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="50"
              r="5"
              fill="rgba(96,165,250,0.5)"
              stroke="rgba(96,165,250,0.8)"
              strokeWidth="1"
            />
            <circle
              cx="40"
              cy="100"
              r="5"
              fill="rgba(74,222,128,0.5)"
              stroke="rgba(74,222,128,0.8)"
              strokeWidth="1"
            />
            <circle
              cx="80"
              cy="100"
              r="5"
              fill="rgba(251,146,60,0.5)"
              stroke="rgba(251,146,60,0.8)"
              strokeWidth="1"
            />
            <circle
              cx="60"
              cy="75"
              r="4"
              fill="rgba(167,139,250,0.5)"
              stroke="rgba(167,139,250,0.8)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      {/* ── User search bar (fixed, always on top) ── */}
      <div className={styles.userSearchBar}>
        <div className={styles.userSearchWrap}>
          <span className={styles.userSearchIcon}>👥</span>
          <input
            className={styles.userSearchInput}
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onFocus={() => setUserFocused(true)}
            onBlur={() => setTimeout(() => setUserFocused(false), 150)}
            placeholder="Search users by name, email or role..."
          />
          {userQuery && (
            <button
              className={styles.userSearchClear}
              onClick={() => setUserQuery("")}
            >
              ✕
            </button>
          )}

          {userFocused && userResults.length > 0 && (
            <div className={styles.userDropdown}>
              {userResults.map((u) => (
                <div key={u.id} className={styles.userDropdownItem}>
                  <div className={styles.userAvatar}>{initials(u.name)}</div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{u.name}</span>
                    <span className={styles.userMeta}>
                      {u.role} · {u.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {userFocused &&
            userQuery.trim().length > 0 &&
            userResults.length === 0 && (
              <div className={styles.userDropdown}>
                <div className={styles.userNoResults}>No users found</div>
              </div>
            )}
        </div>
      </div>

      {/* ── Hero ── */}
      <div className={styles.heroOffset} aria-hidden />
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          AI-Powered Test Automation Platform
        </div>
        <h1 className={styles.heroTitle}>
          Generate<span className={styles.heroAccent}> Perfect </span>
          <br />
          <span className={styles.heroTyped}>
            {typed}
            <span className={styles.cursor}>|</span>
          </span>
        </h1>
        <p className={styles.heroSub}>
          Stop wasting hours writing repetitive test cases. Describe your
          feature, pick your framework, and let AI generate complete,
          professional test suites in seconds —{" "}
          <strong>so you can focus on what actually matters.</strong>
        </p>
        <div className={styles.heroBtns}>
          <button
            className={styles.startBtn}
            onClick={() => navigate("/generate")}
          >
            <span>⚡</span> Start Generating Tests{" "}
            <span className={styles.btnArrow}>→</span>
          </button>
          <button
            className={styles.learnBtn}
            onClick={() => navigate("/history")}
          >
            📜 View History
          </button>
        </div>
        <div className={styles.heroTags}>
          {FRAMEWORKS.map((f) => (
            <FrameworkTag key={f.name} framework={f} />
          ))}
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className={styles.statsStrip} ref={statsRef}>
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={styles.statItem}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Features grid ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>✨ Features</span>
          <h2 className={styles.sectionTitle}>
            Everything a QA Engineer Needs
          </h2>
          <p className={styles.sectionSub}>
            Built by an SDET, for SDETs. Every feature solves a real pain point.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={styles.featureCard}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={styles.featureTop}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureTag}>{f.tag}</span>
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testing pyramid ── */}
      <section className={styles.section}>
        <div className={styles.pyramidSection}>
          <div className={styles.pyramidLeft}>
            <span className={styles.sectionBadge}>🎯 Strategy</span>
            <h2 className={styles.sectionTitle}>
              Built Around the Testing Pyramid
            </h2>
            <p className={styles.sectionSub}>
              TestGen AI understands testing strategy — not just syntax.
              Generate the right ratio of unit, integration, and E2E tests for
              bulletproof coverage.
            </p>
            <ul className={styles.pyramidPoints}>
              <li>✅ Fast unit tests as your safety net</li>
              <li>✅ Integration tests for component boundaries</li>
              <li>✅ E2E tests for critical user journeys</li>
              <li>✅ AI suggests the right level for each feature</li>
            </ul>
          </div>
          <div className={styles.pyramidRight}>
            <div className={styles.pyramid}>
              {PYRAMID_LAYERS.map((layer, i) => (
                <div
                  key={layer.label}
                  className={styles.pyramidRow}
                  style={{
                    "--w": layer.width,
                    "--c": layer.color,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  <div className={styles.pyramidBar}>
                    <span className={styles.pyramidLabel}>{layer.label}</span>
                  </div>
                  <span className={styles.pyramidDesc}>{layer.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote rotator ── */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteInner}>
          <span className={styles.quoteMark}>"</span>
          <p className={styles.quoteText} key={quoteIdx}>
            {QUOTES[quoteIdx].text}
          </p>
          <p className={styles.quoteAuthor}>— {QUOTES[quoteIdx].author}</p>
          <div className={styles.quoteDots}>
            {QUOTES.map((_, i) => (
              <button
                key={i}
                className={`${styles.quoteDot} ${i === quoteIdx ? styles.quoteDotActive : ""}`}
                onClick={() => setQuoteIdx(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>🚀 How It Works</span>
          <h2 className={styles.sectionTitle}>
            From Feature to Test in 3 Steps
          </h2>
        </div>
        <div className={styles.steps}>
          {[
            {
              num: "01",
              title: "Describe the Feature",
              desc: "Write a plain-English description of what needs to be tested. No technical jargon required.",
              icon: "✍️",
            },
            {
              num: "02",
              title: "Choose Your Stack",
              desc: "Select your framework (Selenium, Appium, Cypress...) and coverage type. One click does it.",
              icon: "⚙️",
            },
            {
              num: "03",
              title: "Get Your Tests",
              desc: "AI generates structured, ready-to-run test cases. Export, copy, or link to Jira instantly.",
              icon: "🎉",
            },
          ].map((step, i) => (
            <div
              key={step.num}
              className={styles.step}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className={styles.stepNum}>{step.num}</div>
              {i < 2 && <div className={styles.stepConnector} aria-hidden />}
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaOrb} aria-hidden />
          <h2 className={styles.ctaTitle}>Ready to Automate Your Testing?</h2>
          <p className={styles.ctaSub}>
            Join QA engineers who generate test cases 10x faster with AI.
          </p>
          <button
            className={styles.ctaBtn}
            onClick={() => navigate("/generate")}
          >
            ⚡ Open Test Case Generator
          </button>
        </div>
      </section>
    </div>
  );
}
