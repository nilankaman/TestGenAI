import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TeamPage.module.css";

const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Nilank Aman",
    email: "nilank@testgen.ai",
    role: "Admin",
    avatar: "👤",
    online: true,
    lastActive: "Now",
    tests: 312,
    you: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@testgen.ai",
    role: "Member",
    avatar: "👩",
    online: true,
    lastActive: "Now",
    tests: 198,
    you: false,
  },
  {
    id: 3,
    name: "Kenji Tanaka",
    email: "kenji@testgen.ai",
    role: "Member",
    avatar: "👨",
    online: false,
    lastActive: "2 hours ago",
    tests: 145,
    you: false,
  },
  {
    id: 4,
    name: "Aisha Rahman",
    email: "aisha@testgen.ai",
    role: "Member",
    avatar: "👩",
    online: false,
    lastActive: "Yesterday",
    tests: 89,
    you: false,
  },
  {
    id: 5,
    name: "Marco Rossi",
    email: "marco@testgen.ai",
    role: "Viewer",
    avatar: "👨",
    online: true,
    lastActive: "Now",
    tests: 34,
    you: false,
  },
];

const MOCK_ACTIVITY = [
  {
    id: 1,
    user: "Priya Sharma",
    action: "Generated 8 test cases",
    project: "Mobile Banking",
    time: "3 mins ago",
    type: "generate",
  },
  {
    id: 2,
    user: "Nilank Aman",
    action: "Exported PDF report",
    project: "E-Commerce App",
    time: "12 mins ago",
    type: "export",
  },
  {
    id: 3,
    user: "Marco Rossi",
    action: "Joined the workspace",
    project: "",
    time: "1 hour ago",
    type: "join",
  },
  {
    id: 4,
    user: "Kenji Tanaka",
    action: "Synced 5 issues with Jira",
    project: "API Platform",
    time: "2 hours ago",
    type: "jira",
  },
  {
    id: 5,
    user: "Priya Sharma",
    action: "Generated 12 test cases",
    project: "E-Commerce App",
    time: "3 hours ago",
    type: "generate",
  },
  {
    id: 6,
    user: "Aisha Rahman",
    action: "Exported Excel report",
    project: "Auth Module",
    time: "Yesterday",
    type: "export",
  },
];

const PLANS = [
  {
    id: "free",
    name: "Individual",
    price: "Free",
    current: false,
    features: [
      "1 user",
      "50 generations/month",
      "PDF exports",
      "Jira (read only)",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$29",
    period: "/month",
    current: true,
    highlight: true,
    features: [
      "Up to 10 members",
      "Unlimited generations",
      "PDF + Excel exports",
      "Full Jira sync",
      "Team chat",
      "Shared history",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    current: false,
    features: [
      "Unlimited members",
      "SSO / SAML",
      "Custom AI models",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
];

const ACTIVITY_ICON = { generate: "🧪", export: "📤", join: "👋", jira: "🔗" };

function MembersTab({ members, onRemove, onRoleChange }) {
  return (
    <div className={styles.memberList}>
      {members.map((member) => (
        <div key={member.id} className={styles.memberCard}>
          <div className={styles.memberLeft}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>{member.avatar}</div>
              <div
                className={`${styles.dot} ${member.online ? styles.dotOnline : styles.dotOff}`}
              />
            </div>
            <div className={styles.memberInfo}>
              <div className={styles.memberNameRow}>
                <span className={styles.memberName}>{member.name}</span>
                {member.you && <span className={styles.youBadge}>You</span>}
              </div>
              <span className={styles.memberEmail}>{member.email}</span>
              <span className={styles.memberStatus}>
                {member.online ? "🟢 Active now" : `⚫ ${member.lastActive}`}
              </span>
            </div>
          </div>
          <div className={styles.memberTests}>
            <span className={styles.memberTestVal}>{member.tests}</span>
            <span className={styles.memberTestLabel}>tests</span>
          </div>
          <div className={styles.memberActions}>
            <select
              className={styles.roleSelect}
              value={member.role}
              onChange={(e) => onRoleChange(member.id, e.target.value)}
              disabled={member.you}
            >
              <option>Admin</option>
              <option>Member</option>
              <option>Viewer</option>
            </select>
            {!member.you && (
              <button
                className={styles.removeBtn}
                onClick={() => onRemove(member.id)}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityTab() {
  return (
    <div className={styles.activityList}>
      {MOCK_ACTIVITY.map((item) => (
        <div key={item.id} className={styles.activityRow}>
          <div className={styles.activityIconBox}>
            {ACTIVITY_ICON[item.type]}
          </div>
          <div className={styles.activityBody}>
            <p className={styles.activityText}>
              <strong>{item.user}</strong> {item.action}
              {item.project && (
                <span className={styles.activityProject}>
                  {" "}
                  · {item.project}
                </span>
              )}
            </p>
            <p className={styles.activityTime}>{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InviteTab() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function send(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setEmail("");
      setTimeout(() => setSent(false), 3000);
    }, 1400);
  }

  return (
    <div className={styles.inviteWrap}>
      <div className={styles.inviteCard}>
        <h2 className={styles.inviteTitle}>Invite a team member</h2>
        <p className={styles.inviteSub}>
          They'll receive an email to join your workspace.
        </p>
        <form className={styles.inviteForm} onSubmit={send}>
          <div className={styles.inviteRow}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Email address</label>
              <input
                className={styles.fieldInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                disabled={sending}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Role</label>
              <select
                className={styles.fieldSelect}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Member</option>
                <option>Admin</option>
                <option>Viewer</option>
              </select>
            </div>
          </div>
          <button
            className={`${styles.inviteBtn} ${sent ? styles.inviteBtnDone : ""}`}
            type="submit"
            disabled={sending || !email.trim()}
          >
            {sending ? "Sending…" : sent ? " Invite sent!" : "✉️ Send invite"}
          </button>
        </form>
        <div className={styles.roleTable}>
          <p className={styles.roleTableTitle}>Role permissions</p>
          {[
            {
              role: "Admin",
              color: "#a78bfa",
              desc: "Full access · Manage members · Billing",
            },
            {
              role: "Member",
              color: "#22d3ee",
              desc: "Generate · Export · View all projects",
            },
            {
              role: "Viewer",
              color: "#4ade80",
              desc: "View only · Cannot generate or export",
            },
          ].map((r) => (
            <div key={r.role} className={styles.roleRow}>
              <span className={styles.roleLabel} style={{ color: r.color }}>
                {r.role}
              </span>
              <span className={styles.roleDesc}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlansTab() {
  return (
    <div className={styles.plansGrid}>
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`${styles.planCard} ${plan.highlight ? styles.planHighlight : ""}`}
        >
          {plan.highlight && (
            <div className={styles.planBadge}>Current Plan</div>
          )}
          <h2 className={styles.planName}>{plan.name}</h2>
          <div className={styles.planPrice}>
            <span className={styles.planAmount}>{plan.price}</span>
            {plan.period && (
              <span className={styles.planPeriod}>{plan.period}</span>
            )}
          </div>
          <ul className={styles.planFeatures}>
            {plan.features.map((f) => (
              <li key={f} className={styles.planFeature}>
                <span className={styles.planCheck}></span>
                {f}
              </li>
            ))}
          </ul>
          <button
            className={`${styles.planBtn} ${plan.highlight ? styles.planBtnActive : ""}`}
            disabled={plan.current}
          >
            {plan.current
              ? "Current plan"
              : plan.id === "enterprise"
                ? "Contact sales"
                : "Upgrade"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function TeamPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("members");
  const [members, setMembers] = useState(MOCK_MEMBERS);

  const onlineCount = members.filter((m) => m.online).length;

  function removeMember(id) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function changeRole(id, role) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  }

  const TABS = [
    { id: "members", label: "👥 Members" },
    { id: "activity", label: "📋 Activity" },
    { id: "invite", label: "✉️ Invite" },
    { id: "plans", label: "💎 Plans" },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>
            <span
              className={styles.breadHome}
              onClick={() => navigate("/home")}
            >
              Home
            </span>
            <span className={styles.breadSep}>›</span>
            <span>Team</span>
          </div>
          <div className={styles.titleRow}>
            <div className={styles.headerIcon}>👥</div>
            <div>
              <h1 className={styles.title}>Team Workspace</h1>
              <p className={styles.subtitle}>
                Collaborate, chat, and build better tests together
              </p>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.onlinePill}>
            <div className={styles.onlineDot} />
            {onlineCount} online
          </div>
          <div className={styles.memberAvatars}>
            {members
              .filter((m) => m.online)
              .slice(0, 4)
              .map((m) => (
                <div key={m.id} className={styles.miniAvatar} title={m.name}>
                  {m.avatar}
                </div>
              ))}
          </div>
        </div>
      </header>

      <div className={styles.statStrip}>
        {[
          { val: members.length, label: "Members", color: "" },
          { val: onlineCount, label: "Online", color: "#4ade80" },
          {
            val: members.reduce((s, m) => s + m.tests, 0),
            label: "Total Tests",
            color: "",
          },
          { val: 4, label: "Projects", color: "" },
          { val: "Team", label: "Plan", color: "#a78bfa" },
        ].map((s, i, arr) => (
          <React.Fragment key={s.label}>
            <div className={styles.stat}>
              <span
                className={styles.statVal}
                style={s.color ? { color: s.color } : {}}
              >
                {s.val}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
            {i < arr.length - 1 && <div className={styles.statDivider} />}
          </React.Fragment>
        ))}
      </div>

      <div className={styles.tabsRow}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        {tab === "members" && (
          <MembersTab
            members={members}
            onRemove={removeMember}
            onRoleChange={changeRole}
          />
        )}
        {tab === "activity" && <ActivityTab />}
        {tab === "invite" && <InviteTab />}
        {tab === "plans" && <PlansTab />}
      </div>
    </div>
  );
}
