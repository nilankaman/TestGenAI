import React, { useState } from "react";
import { useAuth } from "@/store/AuthContext";
import styles from "./SearchPage.module.css";

const FRAMEWORKS = [
  "All",
  "Selenium",
  "Appium",
  "RestAssured",
  "Cucumber",
  "JUnit",
  "TestNG",
  "Cypress",
  "Playwright",
];

// Mock data for now — replace with real API calls later
const MOCK_TEST_CASES = [
  {
    id: 1,
    title: "Login with valid credentials",
    framework: "Selenium",
    project: "E-Commerce App",
    date: "2026-03-10",
    status: "COMPLETED",
  },
  {
    id: 2,
    title: "Add to cart functionality",
    framework: "Selenium",
    project: "E-Commerce App",
    date: "2026-03-09",
    status: "COMPLETED",
  },
  {
    id: 3,
    title: "Mobile login flow",
    framework: "Appium",
    project: "Mobile Banking",
    date: "2026-03-08",
    status: "COMPLETED",
  },
  {
    id: 4,
    title: "GET /users endpoint validation",
    framework: "RestAssured",
    project: "API Testing",
    date: "2026-03-07",
    status: "FAILED",
  },
  {
    id: 5,
    title: "Checkout BDD scenarios",
    framework: "Cucumber",
    project: "E-Commerce App",
    date: "2026-03-06",
    status: "COMPLETED",
  },
];

const MOCK_USERS = [
  {
    id: 1,
    name: "Nilank Aman",
    email: "nilank@testgen.com",
    role: "QA Engineer",
    joined: "2026-01-01",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@testgen.com",
    role: "SDET",
    joined: "2026-01-15",
  },
  {
    id: 3,
    name: "Kenji Tanaka",
    email: "kenji@testgen.com",
    role: "QA Lead",
    joined: "2026-02-01",
  },
  {
    id: 4,
    name: "Sara Ahmed",
    email: "sara@testgen.com",
    role: "Automation Tester",
    joined: "2026-02-10",
  },
];

const STATUS_COLOR = {
  COMPLETED: "green",
  FAILED: "red",
  PROCESSING: "yellow",
  PENDING: "gray",
};

export default function SearchPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState("testcases");

  // Test case filters
  const [query, setQuery] = useState("");
  const [framework, setFramework] = useState("All");
  const [project, setProject] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // User search
  const [userQuery, setUserQuery] = useState("");

  // Filter test cases
  const filteredTests = MOCK_TEST_CASES.filter((tc) => {
    const matchQuery =
      !query || tc.title.toLowerCase().includes(query.toLowerCase());
    const matchFramework = framework === "All" || tc.framework === framework;
    const matchProject =
      !project || tc.project.toLowerCase().includes(project.toLowerCase());
    const matchFrom = !dateFrom || tc.date >= dateFrom;
    const matchTo = !dateTo || tc.date <= dateTo;
    return matchQuery && matchFramework && matchProject && matchFrom && matchTo;
  });

  // Filter users
  const filteredUsers = MOCK_USERS.filter((u) => {
    const q = userQuery.toLowerCase();
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  function clearTestFilters() {
    setQuery("");
    setFramework("All");
    setProject("");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>🔍 Search</h1>
        <p className={styles.sub}>
          Search through your test cases or find other users on the platform.
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "testcases" ? styles.tabActive : ""}`}
          onClick={() => setTab("testcases")}
        >
          🧪 Test Cases
        </button>
        <button
          className={`${styles.tab} ${tab === "users" ? styles.tabActive : ""}`}
          onClick={() => setTab("users")}
        >
          👥 Users
        </button>
      </div>

      {/* ── Test Cases Tab ── */}
      {tab === "testcases" && (
        <div className={styles.content}>
          {/* Filters */}
          <div className={styles.filtersCard}>
            <div className={styles.filtersRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Keyword / Title</label>
                <input
                  className={styles.input}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. login, checkout..."
                />
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Project Name</label>
                <input
                  className={styles.input}
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. E-Commerce App"
                />
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Framework</label>
                <select
                  className={styles.select}
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                >
                  {FRAMEWORKS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.filtersRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Date From</label>
                <input
                  className={styles.input}
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Date To</label>
                <input
                  className={styles.input}
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div
                className={styles.filterGroup}
                style={{ justifyContent: "flex-end", alignSelf: "flex-end" }}
              >
                <button className={styles.clearBtn} onClick={clearTestFilters}>
                  ✕ Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className={styles.resultsHeader}>
            <span className={styles.resultCount}>
              {filteredTests.length} result
              {filteredTests.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredTests.length === 0 ? (
            <div className={styles.empty}>
              <span>🔍</span>
              <p>No test cases match your filters.</p>
            </div>
          ) : (
            <div className={styles.cardList}>
              {filteredTests.map((tc) => (
                <div key={tc.id} className={styles.resultCard}>
                  <div className={styles.resultLeft}>
                    <span
                      className={`${styles.statusDot} ${styles[`dot_${STATUS_COLOR[tc.status]}`]}`}
                    />
                    <div>
                      <p className={styles.resultTitle}>{tc.title}</p>
                      <p className={styles.resultMeta}>
                        <span className={styles.badge}>{tc.framework}</span>
                        <span className={styles.metaSep}>·</span>
                        <span>{tc.project}</span>
                        <span className={styles.metaSep}>·</span>
                        <span>{tc.date}</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`${styles.statusPill} ${styles[`pill_${STATUS_COLOR[tc.status]}`]}`}
                  >
                    {tc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Users Tab ── */}
      {tab === "users" && (
        <div className={styles.content}>
          <div className={styles.filtersCard}>
            <div className={styles.filterGroup} style={{ maxWidth: "400px" }}>
              <label className={styles.filterLabel}>
                Search by name, email or role
              </label>
              <input
                className={styles.input}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="e.g. Nilank, QA Engineer..."
              />
            </div>
          </div>

          <div className={styles.resultsHeader}>
            <span className={styles.resultCount}>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}{" "}
              found
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className={styles.empty}>
              <span>👥</span>
              <p>No users match your search.</p>
            </div>
          ) : (
            <div className={styles.userGrid}>
              {filteredUsers.map((u) => {
                const initials = u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                return (
                  <div key={u.id} className={styles.userCard}>
                    <div className={styles.userAvatar}>{initials}</div>
                    <div className={styles.userInfo}>
                      <p className={styles.userName}>{u.name}</p>
                      <p className={styles.userEmail}>{u.email}</p>
                      <span className={styles.userRole}>{u.role}</span>
                    </div>
                    <p className={styles.userJoined}>
                      Joined {new Date(u.joined).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
