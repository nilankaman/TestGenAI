import React, { useEffect, useState } from "react";
import s from "./CodeModal.module.css";

export default function CodeModal({ code, title, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function copy() {
    navigator.clipboard.writeText(code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (!code) return null;

  return (
    <div
      className={s.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={s.modal}>
        <div className={s.header}>
          <p className={s.title}>{title || "Code"}</p>
          <div className={s.headerActions}>
            <button
              className={`${s.copyBtn} ${copied ? s.copyDone : ""}`}
              onClick={copy}
            >
              {copied ? " Copied" : "⎘ Copy"}
            </button>
            <button className={s.closeBtn} onClick={onClose}>
              ✕
            </button>
          </div>
        </div>
        <pre className={s.code}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
