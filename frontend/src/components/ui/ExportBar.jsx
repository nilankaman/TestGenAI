import React, { useState } from "react";
import ShareModal from "./ShareModal";
import { useShareStore } from "@/store/useShareStore";
import s from "./ExportBar.module.css";

async function toPdf(testCases, project) {
  const { default: jsPDF } =
    await import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`${project} — Test Cases`, 14, 20);
  let y = 30;
  testCases.forEach((tc, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text(`${i + 1}. ${tc.title}`, 14, y);
    y += 6;
    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    doc.text(`Type: ${tc.type}  |  Method: ${tc.methodName || ""}`, 14, y);
    y += 5;
    if (tc.description) {
      const lines = doc.splitTextToSize(tc.description, 180);
      doc.text(lines, 14, y);
      y += lines.length * 4 + 3;
    }
    y += 4;
  });
  doc.save(`${project}-tests.pdf`);
}

async function toExcel(testCases, project) {
  const XLSX =
    await import("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
  const rows = testCases.map((tc) => ({
    Title: tc.title,
    Type: tc.type,
    Method: tc.methodName,
    Description: tc.description,
    Code: tc.codeSnippet,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Test Cases");
  XLSX.writeFile(wb, `${project}-tests.xlsx`);
}

async function screenshot() {
  const el = document.getElementById("test-output");
  if (!el) {
    alert("No test output visible");
    return;
  }
  const { default: html2canvas } =
    await import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
  const canvas = await html2canvas(el);
  const link = document.createElement("a");
  link.download = "testcases.png";
  link.href = canvas.toDataURL();
  link.click();
}

export default function ExportBar({
  testCases = [],
  project = "TestGen AI",
  framework = "",
}) {
  const [loading, setLoading] = useState(null);
  const [done, setDone] = useState(null);
  const [shareOpen, setShare] = useState(false);
  const { canShare, left, isPaid, blocked, timeLeft } = useShareStore();
  const disabled = testCases.length === 0;

  async function run(id, fn) {
    setLoading(id);
    setDone(null);
    try {
      await fn();
      setDone(id);
      setTimeout(() => setDone(null), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  }

  const exports = [
    {
      id: "pdf",
      icon: "📄",
      label: "PDF",
      fn: () => toPdf(testCases, project),
      color: "#f87171",
    },
    {
      id: "xl",
      icon: "📊",
      label: "Excel",
      fn: () => toExcel(testCases, project),
      color: "#4ade80",
    },
    {
      id: "img",
      icon: "📸",
      label: "Screenshot",
      fn: screenshot,
      color: "#22d3ee",
    },
  ];

  function shareTitle() {
    if (disabled) return "Generate test cases first";
    if (blocked === "cooldown")
      return `Cooldown active — ${timeLeft} remaining`;
    if (blocked === "daily_limit")
      return "Daily limit reached — resets at midnight";
    return "Share with your team";
  }

  return (
    <>
      <div className={s.bar}>
        <span className={s.label}>Export</span>
        {exports.map((btn) => {
          const busy = loading === btn.id;
          const ok = done === btn.id;
          return (
            <button
              key={btn.id}
              className={`${s.btn} ${ok ? s.btnDone : ""}`}
              style={{ "--c": btn.color }}
              onClick={() => run(btn.id, btn.fn)}
              disabled={!!loading || disabled}
              title={disabled ? "Generate test cases first" : btn.label}
            >
              {busy ? <span className={s.spin} /> : ok ? "" : btn.icon}
              <span>{ok ? "Done!" : btn.label}</span>
            </button>
          );
        })}

        <div className={s.divider} />

        <button
          className={`${s.shareBtn} ${!canShare && !disabled ? s.shareLocked : ""}`}
          onClick={() => setShare(true)}
          disabled={disabled}
          title={shareTitle()}
        >
          {!canShare && !disabled ? "🔒" : "📤"}
          <span>Share</span>
          {!isPaid && !disabled && (
            <span className={`${s.pill} ${!canShare ? s.pillWarn : ""}`}>
              {canShare
                ? `${left} left`
                : blocked === "cooldown"
                  ? timeLeft
                  : "midnight"}
            </span>
          )}
        </button>

        {disabled && <span className={s.hint}>Generate test cases first</span>}
      </div>

      {shareOpen && (
        <ShareModal
          testCases={testCases}
          project={project}
          framework={framework}
          onClose={() => setShare(false)}
        />
      )}
    </>
  );
}
