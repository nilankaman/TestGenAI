import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useShareStore } from "@/store/useShareStore";
import { useAuth } from "@/store/AuthContext";
import s from "./Sidebar.module.css";

const NAV = [
  { to: "/home", icon: "🏠", key: "home" },
  { to: "/dashboard", icon: "📊", key: "dashboard" },
  { to: "/generate", icon: "⚡", key: "generate" },
  { to: "/chat", icon: "🤖", key: "chat", badge: "AI", color: "purple" },
  { to: "/team", icon: "👥", key: "team", badge: "NEW", color: "green" },
  { to: "/projects", icon: "📂", key: "projects" },
  { to: "/history", icon: "📜", key: "history" },
  { to: "/attachments", icon: "📎", key: "attachments" },
  { to: "/portfolio", icon: "🗂️", key: "portfolio" },
  {
    to: "/cicd-generator",
    icon: "🔄",
    key: "cicd",
    badge: "NEW",
    color: "green",
  },
  { to: "/search", icon: "🔍", key: "search" },
  {
    to: "/subscription",
    icon: "💎",
    key: "plan",
    badge: "PLAN",
    color: "plan",
  },
];

const INTEGRATIONS = [
  { to: "/integrations/jira", icon: "🔗", label: "Jira" },
  { to: "/integrations/confluence", icon: "📋", label: "Confluence" },
  { to: "/integrations/cicd", icon: "🔄", label: "CI / CD" },
];

const LANGS = [
  { code: "en", label: "EN" },
  { code: "ja", label: "日本語" },
  { code: "hi", label: "हिं" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국" },
];

export default function Sidebar({ open, onNav }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isPaid, left, used, dailyLimit, plan } = useShareStore();

  // Admin link only shows when logged in with the admin token
  const isAdmin =
    localStorage.getItem("tg-token") === "admin-token-2024-testgen";

  function go(path) {
    navigate(path);
    onNav?.();
  }

  function switchLang(code) {
    i18n.changeLanguage(code);
    localStorage.setItem("testgen-lang", code);
  }

  // The plan badge shows "Pro" or "Team" when paid, "2 left" when free
  function planBadgeLabel() {
    if (!isPaid) return `${left} left`;
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  }

  return (
    <aside className={`${s.sidebar} ${open ? s.open : s.closed}`}>
      <button className={s.logo} onClick={() => go("/home")}>
        <span className={s.logoIcon}>🧪</span>
        <div>
          <span className={s.logoName}>TestGen AI</span>
          <span className={s.logoTag}>v1.0 Beta</span>
        </div>
      </button>

      <nav className={s.nav}>
        <span className={s.label}>WORKSPACE</span>
        <ul className={s.list}>
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => onNav?.()}
                className={({ isActive }) =>
                  `${s.item} ${isActive ? s.active : ""}`
                }
              >
                <span className={s.icon}>{item.icon}</span>
                <span>{t(`nav.${item.key}`, item.key)}</span>
                {item.badge && (
                  <span className={`${s.badge} ${s[`badge_${item.color}`]}`}>
                    {item.color === "plan" ? planBadgeLabel() : item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}

          {isAdmin && (
            <li>
              <NavLink
                to="/admin"
                onClick={() => onNav?.()}
                className={({ isActive }) =>
                  `${s.item} ${isActive ? s.active : ""}`
                }
              >
                <span className={s.icon}>🛡️</span>
                <span>Admin</span>
                <span className={`${s.badge} ${s.badge_admin}`}>ADMIN</span>
              </NavLink>
            </li>
          )}
        </ul>

        <span className={s.label}>INTEGRATIONS</span>
        <ul className={s.list}>
          {INTEGRATIONS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => onNav?.()}
                className={({ isActive }) =>
                  `${s.item} ${isActive ? s.active : ""}`
                }
              >
                <span className={s.icon}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={s.planCard} onClick={() => go("/subscription")}>
          <div className={s.planRow}>
            <span className={s.planName}>
              {isPaid
                ? `💎 ${plan.charAt(0).toUpperCase() + plan.slice(1)}`
                : "💎 Free Plan"}
            </span>
            <span className={s.planArrow}>{isPaid ? "✓" : "→"}</span>
          </div>
          <p className={s.planDesc}>
            {isPaid
              ? "Unlimited sharing · No cooldown"
              : `${left} share${left !== 1 ? "s" : ""} left today`}
          </p>
          {!isPaid && (
            <>
              <div className={s.planBar}>
                <div
                  className={s.planFill}
                  style={{
                    width: `${Math.min((used / dailyLimit) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className={s.planMeta}>
                {used} / {dailyLimit} used today
              </span>
            </>
          )}
        </div>
      </nav>

      <div className={s.langWrap}>
        <span className={s.langLabel}>LANGUAGE</span>
        <div className={s.langPills}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`${s.pill} ${i18n.language === l.code ? s.pillActive : ""}`}
              onClick={() => switchLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
