import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import { useTheme } from "@/store/ThemeContext";
import s from "./Topbar.module.css";

export default function Topbar({ onMenuClick, menuOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function go(path) {
    setDropOpen(false);
    navigate(path);
  }

  function handleLogout() {
    setDropOpen(false);
    logout();
    navigate("/login");
  }

  // Cycle dark → light → system → dark
  function cycleTheme() {
    const next = { dark: "light", light: "system", system: "dark" };
    setTheme(next[theme] || "dark");
  }

  const themeIcon = { dark: "🌙", light: "☀️", system: "💻" };
  const themeTitle = {
    dark: "Dark mode — click for Light",
    light: "Light mode — click for System",
    system: "System mode — click for Dark",
  };

  return (
    <header className={s.bar}>
      {/* Hamburger — three lines that toggle sidebar */}
      <button
        className={s.burger}
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
        title={menuOpen ? "Close sidebar" : "Open sidebar"}
      >
        <span className={`${s.bLine} ${menuOpen ? s.bTop : ""}`} />
        <span className={`${s.bLine} ${menuOpen ? s.bMid : ""}`} />
        <span className={`${s.bLine} ${menuOpen ? s.bBot : ""}`} />
      </button>

      <button className={s.brand} onClick={() => navigate("/home")}>
        <span className={s.brandName}>TestGen</span>
        <span className={s.brandAccent}>&nbsp;AI</span>
      </button>

      <div className={s.actions}>
        <button className={s.btnPrimary} onClick={() => navigate("/generate")}>
          ⚡ Generate
        </button>
        <button className={s.btnGhost} onClick={() => navigate("/dashboard")}>
          📊 Dashboard
        </button>
      </div>

      <div className={s.right}>
        {/* Theme toggle button */}
        <button
          className={s.themeBtn}
          onClick={cycleTheme}
          title={themeTitle[theme]}
        >
          {themeIcon[theme] || "🌙"}
        </button>

        <div className={s.statusPill}>
          <span className={s.statusDot} />
          Connected
        </div>

        <div className={s.avatarWrap} ref={dropRef}>
          <button className={s.avatar} onClick={() => setDropOpen((v) => !v)}>
            {initials}
          </button>

          {dropOpen && (
            <div className={s.drop}>
              <div className={s.dropHead}>
                <div className={s.dropAvatar}>{initials}</div>
                <div>
                  <p className={s.dropName}>{user?.name || "User"}</p>
                  <p className={s.dropEmail}>{user?.email || ""}</p>
                </div>
              </div>
              <div className={s.divider} />
              <button className={s.dropItem} onClick={() => go("/profile")}>
                {" "}
                👤 Profile{" "}
              </button>
              <button className={s.dropItem} onClick={() => go("/settings")}>
                {" "}
                ⚙️ Settings{" "}
              </button>
              <button
                className={s.dropItem}
                onClick={() => go("/subscription")}
              >
                {" "}
                💎 Plan{" "}
              </button>
              <button className={s.dropItem} onClick={() => go("/portfolio")}>
                {" "}
                🗂️ Portfolio{" "}
              </button>
              <div className={s.divider} />
              <button
                className={`${s.dropItem} ${s.dropRed}`}
                onClick={handleLogout}
              >
                🚪 Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
