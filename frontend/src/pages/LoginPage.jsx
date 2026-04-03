import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import styles from "./LoginPage.module.css";

const FLOATING_TESTS = [
  {
    type: "PASS",
    text: "validLogin_returnsJwt()",
    delay: "0s",
    top: "12%",
    left: "5%",
  },
  {
    type: "PASS",
    text: "register_newUser_returns200()",
    delay: "1.2s",
    top: "26%",
    left: "8%",
  },
  {
    type: "FAIL",
    text: "nullPassword_throwsException()",
    delay: "0.6s",
    top: "42%",
    left: "4%",
  },
  {
    type: "PASS",
    text: "jwtToken_isValid()",
    delay: "1.8s",
    top: "57%",
    left: "7%",
  },
  {
    type: "SKIP",
    text: "oauthLogin_pending()",
    delay: "0.3s",
    top: "72%",
    left: "10%",
  },
  {
    type: "PASS",
    text: "bcrypt_hashPassword()",
    delay: "2.1s",
    top: "18%",
    right: "5%",
  },
  {
    type: "FAIL",
    text: "expiredToken_returns401()",
    delay: "0.9s",
    top: "34%",
    right: "4%",
  },
  {
    type: "PASS",
    text: "corsConfig_allowsFrontend()",
    delay: "1.5s",
    top: "50%",
    right: "7%",
  },
  {
    type: "PASS",
    text: "healthCheck_returnsUp()",
    delay: "2.4s",
    top: "66%",
    right: "5%",
  },
  {
    type: "PASS",
    text: "coverageScore_inValidRange()",
    delay: "0.4s",
    top: "80%",
    right: "8%",
  },
];

const TYPE_COLOR = { PASS: "#4ade80", FAIL: "#f87171", SKIP: "#fb923c" };
const TYPE_ICON = { PASS: "", FAIL: "✗", SKIP: "○" };

const TERMINAL_LINES = [
  { text: "$ mvn test", color: "#e8e8f0", delay: 0 },
  { text: "Running TestGenerationServiceTest", color: "#6b6b8a", delay: 500 },
  { text: " validRequest_returnsTestCases", color: "#4ade80", delay: 1100 },
  { text: " blankDescription_throws", color: "#4ade80", delay: 1600 },
  { text: " coverageScore_inValidRange", color: "#4ade80", delay: 2100 },
  { text: " generate_callsAiProviderOnce", color: "#4ade80", delay: 2600 },
  { text: "Running GenerateApiTest", color: "#6b6b8a", delay: 3100 },
  { text: " login_validCredentials_returns200", color: "#4ade80", delay: 3600 },
  { text: " generate_noToken_returns401", color: "#4ade80", delay: 4100 },
  { text: "", color: "#6b6b8a", delay: 4500 },
  { text: "Tests run: 23, Failures: 0", color: "#7c6cfa", delay: 4800 },
  { text: "BUILD SUCCESS ", color: "#4ade80", delay: 5300 },
];

function Terminal() {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    function runAnimation() {
      setVisible([]);
      TERMINAL_LINES.forEach((_, i) => {
        setTimeout(
          () => setVisible((prev) => [...prev, i]),
          TERMINAL_LINES[i].delay,
        );
      });
    }

    runAnimation();
    const id = setInterval(runAnimation, 7500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.terminal}>
      <div className={styles.termHeader}>
        <span className={styles.termDot} style={{ background: "#f87171" }} />
        <span className={styles.termDot} style={{ background: "#fb923c" }} />
        <span className={styles.termDot} style={{ background: "#4ade80" }} />
        <span className={styles.termTitle}>test-runner — bash</span>
      </div>
      <div className={styles.termBody}>
        {TERMINAL_LINES.map((line, i) => (
          <p
            key={i}
            className={`${styles.termLine} ${visible.includes(i) ? styles.termLineVisible : ""}`}
            style={{ color: line.color }}
          >
            {line.text}
          </p>
        ))}
        <span className={styles.termCursor} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Incorrect email or password.");
        return;
      }

      login({
        name: data.user?.name || email.split("@")[0],
        email: email,
        token: data.token,
        plan: data.user?.plan || "free",
      });
      navigate("/home");
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleDemo() {
    login({
      name: "Demo User",
      email: "demo@testgen.ai",
      token: "demo-token",
      plan: "free",
    });
    navigate("/home");
  }

  return (
    <div className={styles.page}>
      {/* Left side — animated visuals */}
      <div className={styles.left}>
        {/* Floating test badges */}
        {FLOATING_TESTS.map((t, i) => (
          <div
            key={i}
            className={styles.badge}
            style={{
              top: t.top,
              left: t.left,
              right: t.right,
              animationDelay: t.delay,
              borderColor: `${TYPE_COLOR[t.type]}40`,
              color: TYPE_COLOR[t.type],
            }}
          >
            <span>{TYPE_ICON[t.type]}</span>
            <span className={styles.badgeText}>{t.text}</span>
          </div>
        ))}

        <div className={styles.leftInner}>
          <div className={styles.leftLogo}>
            <span className={styles.leftLogoIcon}>🧪</span>
            <div>
              <p className={styles.leftLogoName}>TestGen AI</p>
              <p className={styles.leftLogoSub}>QA Platform</p>
            </div>
          </div>

          <h2 className={styles.leftTitle}>Write tests faster.</h2>
          <h2 className={styles.leftTitle2}>Ship with confidence.</h2>
          <p className={styles.leftSub}>
            AI-powered test generation across 10 frameworks. Plain English in —
            production-ready test code out.
          </p>

          <Terminal />

          <div className={styles.leftStats}>
            {[
              { num: "10+", lbl: "frameworks" },
              { num: "<10s", lbl: "per feature" },
              { num: "23", lbl: "tests passing" },
            ].map((s) => (
              <div key={s.lbl} className={styles.leftStat}>
                <span className={styles.leftStatNum}>{s.num}</span>
                <span className={styles.leftStatLbl}>{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h1 className={styles.cardTitle}>Welcome back</h1>
          <p className={styles.cardSub}>Sign in to your workspace</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMsg}>{error}</div>}

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              className={styles.submitBtn}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} /> Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button className={styles.demoBtn} onClick={handleDemo}>
            👤 Try demo — no account needed
          </button>

          <p className={styles.footer}>
            No account?{" "}
            <Link to="/register" className={styles.footerLink}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
