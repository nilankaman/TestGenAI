import React, { useState } from "react";
import styles from "./IntegrationPage.module.css";

const MOCK_DOCS = [
  {
    id: 1,
    title: "Login Feature Requirements",
    space: "QA Docs",
    updated: "2026-03-10",
    author: "Nilank Aman",
  },
  {
    id: 2,
    title: "Checkout Flow Specification",
    space: "Product",
    updated: "2026-03-08",
    author: "Priya Sharma",
  },
  {
    id: 3,
    title: "API Contract v2.0",
    space: "Engineering",
    updated: "2026-03-07",
    author: "Kenji Tanaka",
  },
  {
    id: 4,
    title: "Mobile App Test Strategy",
    space: "QA Docs",
    updated: "2026-03-05",
    author: "Sara Ahmed",
  },
  {
    id: 5,
    title: "Performance Testing Guidelines",
    space: "QA Docs",
    updated: "2026-03-01",
    author: "Nilank Aman",
  },
];

export default function ConfluencePage() {
  const [search, setSearch] = useState("");
  const [connected, setConnected] = useState(false);

  const filtered = MOCK_DOCS.filter(
    (d) =>
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.space.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.integrationLogo}>📋</div>
          <div>
            <h1 className={styles.title}>Confluence Integration</h1>
            <p className={styles.sub}>
              Pull requirements and specs directly from Confluence to generate
              test cases.
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          {connected ? (
            <span className={styles.connectedBadge}>✅ Connected</span>
          ) : (
            <button
              className={styles.connectBtn}
              onClick={() => setConnected(true)}
            >
              🔌 Connect Confluence
            </button>
          )}
        </div>
      </div>

      <div className={styles.statsRow}>
        {[
          { label: "Documents", value: MOCK_DOCS.length, icon: "📄" },
          {
            label: "Spaces",
            value: [...new Set(MOCK_DOCS.map((d) => d.space))].length,
            icon: "🗂️",
          },
          {
            label: "Authors",
            value: [...new Set(MOCK_DOCS.map((d) => d.author))].length,
            icon: "👤",
          },
          { label: "This Week", value: 3, icon: "📅" },
        ].map((s) => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents by title or space..."
        />
      </div>

      <div className={styles.cardGrid}>
        {filtered.map((doc) => (
          <div key={doc.id} className={styles.docCard}>
            <div className={styles.docIcon}>📄</div>
            <div className={styles.docInfo}>
              <p className={styles.docTitle}>{doc.title}</p>
              <p className={styles.docMeta}>
                <span className={styles.spaceBadge}>{doc.space}</span>
                <span>
                  · {doc.author} · {doc.updated}
                </span>
              </p>
            </div>
            <button className={styles.actionBtn}>Generate Tests</button>
          </div>
        ))}
      </div>

      <div className={styles.mockNote}>
        ⚠️ This is a mock UI. Connect your Confluence workspace to see real
        documents.
      </div>
    </div>
  );
}
