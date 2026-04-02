import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useGenerateStore from "@/store/useGenerateStore";
import styles from "./HistoryPage.module.css";

const STATUS_COLORS = {
  COMPLETED: "green",
  FAILED: "red",
  PROCESSING: "yellow",
  PENDING: "gray",
};

export default function HistoryPage() {
  const { t } = useTranslation();
  const { history, historyLoading, loadHistory } = useGenerateStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t("history.title")}</h1>
        <p className={styles.pageSub}>{t("history.subtitle")}</p>
      </div>

      {historyLoading && (
        <div className={styles.loading}>
          <span className={styles.spinner} aria-label="Loading" />
        </div>
      )}

      {!historyLoading && history.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden>
            📜
          </span>
          <p>{t("history.empty")}</p>
          <p className={styles.emptySub}>{t("history.emptySub")}</p>
        </div>
      )}

      {!historyLoading && history.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("history.framework")}</th>
                <th>{t("history.coverage")}</th>
                <th>{t("history.tests")}</th>
                <th>{t("history.status")}</th>
                <th>{t("history.date")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id} className={styles.row}>
                  <td className={styles.idCell}>#{row.id}</td>
                  <td>
                    <span className={styles.frameworkBadge}>
                      {row.framework}
                    </span>
                  </td>
                  <td className={styles.mutedCell}>{row.coverageType}</td>
                  <td className={styles.countCell}>
                    {row.testCases?.length ?? "—"}
                  </td>
                  <td>
                    <span
                      className={`${styles.status} ${styles[`status_${STATUS_COLORS[row.status]}`]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className={styles.mutedCell}>
                    {formatDate(row.createdAt)}
                  </td>
                  <td>
                    <button
                      className={styles.reopenBtn}
                      onClick={() => navigate("/generate")}
                    >
                      {t("history.reopen")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
