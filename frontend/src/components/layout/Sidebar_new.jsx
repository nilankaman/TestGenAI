import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useShareStore } from "@/store/useShareStore";
import { useAuth } from "@/store/AuthContext";
import s from "./Sidebar.module.css";

const nav = [
  { to: "/home", icon: "🏠", key: "home" },
  { to: "/dashboard", icon: "📊", key: "dashboard" },
  { to: "/generate", icon: "⚡", key: "generate" },
  { to: "/chat", icon: "🤖", key: "chat", badge: "AI", badgeColor: "purple" },
  { to: "/team", icon: "👥", key: "team", badge: "NEW", badgeColor: "green" },
  { to: "/projects", icon: "📂", key: "projects" },
  { to: "/history", icon: "📜", key: "history" },
  { to: "/attachments", icon: "📎", key: "attachments" },
  { to: "/portfolio", icon: "🗂️", key: "portfolio" },
  {
    to: "/cicd-generator",
    icon: "🔄",
    key: "cicd",
    badge: "NEW",
    badgeColor: "green",
  },
  { to: "/search", icon: "🔍", key: "search" },
  {
    to: "/subscription",
    icon: "💎",
    key: "plan",
    badge: "PLAN",
    badgeColor: "plan",
  },
];

const integrations = [
  { to: "/integrations/jira", icon: "🔗", label: "Jira" },
  { to: "/integrations/confluence", icon: "📋", label: "Confluence" },
  { to: "/integrations/cicd", icon: "🔄", label: "CI / CD" },
];

const langs = [
  { code: "en", label: "EN" },
  { code: "ja", label: "日本語" },
  { code: "hi", label: "हिं" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국" },
];

export default function Sidebar({ open, onNav }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { isPaid, left, used, dailyLimit, plan } = useShareStore();

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

  function badgeLabel(item) {
    if (item.badgeColor !== "plan") return item.badge;
    return isPaid
      ? plan.charAt(0).toUpperCase() + plan.slice(1)
      : `${left} left`;
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
        <p className={s.label}>WORKSPACE</p>
        <ul className={s.list}>
          {nav.map((item) => (
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
                  <span
                    className={`${s.badge} ${s[`badge_${item.badgeColor}`]}`}
                  >
                    {badgeLabel(item)}
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

        <p className={s.label}>INTEGRATIONS</p>
        <ul className={s.list}>
          {integrations.map((item) => (
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
            <span className={s.planArrow}>{isPaid ? "" : "→"}</span>
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
        <p className={s.langLabel}>LANGUAGE</p>
        <div className={s.langPills}>
          {langs.map((l) => (
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
