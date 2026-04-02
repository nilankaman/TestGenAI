import React from "react";
import { useTranslation } from "react-i18next";
import useGenerateStore from "@/store/useGenerateStore";
import styles from "./StatsBar.module.css";

export default function StatsBar() {
  const { t } = useTranslation();
  const { stats } = useGenerateStore();

  const positive = stats?.positiveCount ?? 0;
  const negative = stats?.negativeCount ?? 0;
  const edge = stats?.edgeCount ?? 0;
  const coverage = stats?.coverageScore;

  return (
    <footer className={styles.bar}>
      <Stat dot="green" num={positive} label={t("stats.positive")} />
      <Stat dot="pink" num={negative} label={t("stats.negative")} />
      <Stat dot="yellow" num={edge} label={t("stats.edge")} />
      <Stat
        dot="purple"
        num={coverage != null ? `${coverage}%` : "—"}
        label={t("stats.coverage")}
        purple
        ml
      />
    </footer>
  );
}

function Stat({ dot, num, label, purple, ml }) {
  return (
    <div className={`${styles.stat} ${ml ? styles.statRight : ""}`}>
      <span className={`${styles.dot} ${styles[`dot_${dot}`]}`} aria-hidden />
      <span className={`${styles.num} ${purple ? styles.numPurple : ""}`}>
        {num}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
