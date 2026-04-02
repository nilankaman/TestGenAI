import React from "react";
import { useNavigate } from "react-router-dom";
import { useShareStore } from "@/store/useShareStore";
import s from "./SubscriptionPage.module.css";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "¥0",
    color: "#6b7280",
    features: [
      { text: "50 AI generations/month", on: true },
      { text: "PDF · Excel · Screenshot", on: true },
      { text: "3 team shares per day", on: true },
      { text: "6-hour cooldown between shares", on: true },
      { text: "Resets at midnight", on: true },
      { text: "Unlimited sharing", on: false },
      { text: "Priority AI queue", on: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "¥1,490",
    period: "/month",
    color: "#7c6cfa",
    badge: "Most Popular",
    features: [
      { text: "Unlimited AI generations", on: true },
      { text: "PDF · Excel · Screenshot", on: true },
      { text: "Unlimited team sharing", on: true },
      { text: "No cooldown or daily limits", on: true },
      { text: "Share history & analytics", on: true },
      { text: "Priority AI queue", on: true },
      { text: "Email delivery of shares", on: true },
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "¥3,980",
    period: "/month",
    color: "#22d3ee",
    features: [
      { text: "Everything in Pro", on: true },
      { text: "Up to 10 members", on: true },
      { text: "Shared workspace", on: true },
      { text: "Full Jira & CI/CD integration", on: true },
      { text: "Admin dashboard", on: true },
      { text: "Priority support", on: true },
      { text: "SSO / SAML", on: true },
    ],
  },
];

function HistoryRow({ entry }) {
  const d = new Date(entry.time);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const day = d.toLocaleDateString([], { month: "short", day: "numeric" });
  const icon =
    { pdf: "📄", screenshot: "📸", excel: "📊" }[entry.fileType] || "📤";
  return (
    <div className={s.hRow}>
      <span>{icon}</span>
      <div className={s.hInfo}>
        <span className={s.hProject}>{entry.project || "Untitled"}</span>
        <span className={s.hMeta}>
          {entry.testCount || 0} tests · {(entry.fileType || "").toUpperCase()}{" "}
          · {entry.recipients?.length || 0} recipients
        </span>
      </div>
      <span className={s.hTime}>
        {day} {time}
      </span>
    </div>
  );
}

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const {
    plan,
    isPaid,
    canShare,
    left,
    used,
    dailyLimit,
    blocked,
    timeLeft,
    cooldownEnd,
    history,
  } = useShareStore();

  const midnight = new Date();
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  const barPct = isPaid ? 100 : Math.min((used / dailyLimit) * 100, 100);

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <h1 className={s.title}>Subscription & Sharing</h1>

        {/* Usage card */}
        <div className={s.usageCard}>
          <div className={s.usageLeft}>
            <div className={s.usageIcon}>📤</div>
            <div>
              <p className={s.usageTitle}>Team Shares Today</p>
              <p className={s.usageSub}>
                {isPaid
                  ? "Unlimited — no cooldown"
                  : `Free plan · resets at ${midnight.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
              </p>
            </div>
          </div>
          {!isPaid && (
            <div className={s.usageRight}>
              <span className={s.usageNum}>{used}</span>
              <span className={s.usageDen}>/ {dailyLimit}</span>
              <div className={s.usageBarWrap}>
                <div className={s.usageTrack}>
                  <div
                    className={`${s.usageFill} ${used >= dailyLimit ? s.usageFull : ""}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}
          {isPaid && <div className={s.unlimitedBadge}> Unlimited</div>}
        </div>

        {/* Status alert */}
        {!isPaid && (
          <div className={`${s.alert} ${blocked ? s.alertWarn : s.alertOk}`}>
            <span>
              {blocked === "cooldown"
                ? "⏳"
                : blocked === "daily_limit"
                  ? "🚫"
                  : "✅"}
            </span>
            <span className={s.alertText}>
              {blocked === "cooldown" && (
                <>
                  <strong>6-hour cooldown active.</strong> Next share in{" "}
                  <strong>{timeLeft}</strong>.
                </>
              )}
              {blocked === "daily_limit" && (
                <>
                  <strong>Daily limit reached.</strong> Resets at midnight.
                </>
              )}
              {!blocked && (
                <>
                  <strong>
                    {left} share{left !== 1 ? "s" : ""} remaining
                  </strong>{" "}
                  today.
                </>
              )}
            </span>
          </div>
        )}

        {/* Share history */}
        <div className={s.historyCard}>
          <div className={s.historyHead}>
            <h2 className={s.sectionTitle}>Today's Share History</h2>
            <span className={s.historyCount}>{history.length} sent</span>
          </div>
          {history.length === 0 ? (
            <div className={s.historyEmpty}>
              <span>📭</span>
              <p>Nothing shared today.</p>
            </div>
          ) : (
            <div>
              {[...history].reverse().map((e, i) => (
                <HistoryRow key={i} entry={e} />
              ))}
            </div>
          )}
        </div>

        {/* Plans */}
        <h2 className={s.sectionTitle} style={{ marginTop: 28 }}>
          Plans
        </h2>
        <div className={s.plansGrid}>
          {PLANS.map((p) => {
            const isCurrent = p.id === plan;
            return (
              <div
                key={p.id}
                className={`${s.planCard} ${p.badge ? s.planHighlight : ""} ${isCurrent ? s.planCurrent : ""}`}
                style={{ "--pc": p.color }}
              >
                {p.badge && (
                  <div className={s.planBadge} style={{ background: p.color }}>
                    {p.badge}
                  </div>
                )}
                {isCurrent && <div className={s.currentTag}> Active</div>}
                <h3 className={s.planName} style={{ color: p.color }}>
                  {p.name}
                </h3>
                <div className={s.planPrice}>
                  <span className={s.planAmt}>{p.price}</span>
                  {p.period && <span className={s.planPeriod}>{p.period}</span>}
                </div>
                <ul className={s.planFeatures}>
                  {p.features.map((f, i) => (
                    <li
                      key={i}
                      className={`${s.planFeature} ${!f.on ? s.planFeatureOff : ""}`}
                    >
                      <span className={f.on ? s.checkOn : s.checkOff}>
                        {f.on ? "" : "✗"}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <button
                  className={`${s.planBtn} ${isCurrent ? s.planBtnCurrent : ""}`}
                  style={
                    !isCurrent && p.id !== "free" ? { background: p.color } : {}
                  }
                  onClick={() => {
                    if (isCurrent) return;
                    if (p.id === "free") return;
                    // Go to payment page with plan in query string
                    navigate(`/payment?plan=${p.id}`);
                  }}
                  disabled={isCurrent}
                >
                  {isCurrent
                    ? "Current plan"
                    : p.id === "free"
                      ? "Downgrade"
                      : `Upgrade to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <p className={s.disclaimer}>
          This is a portfolio demo. The payment page is a mock — no real charges
          occur.
        </p>
      </div>
    </div>
  );
}
