import React from "react";
import TestCaseCard from "./TestCaseCard";
import ExportBar from "@/components/ui/ExportBar";
import s from "./TestCaseList.module.css";

export default function TestCaseList({ results, project = "My Project" }) {
  if (!results || !results.testCases?.length) return null;

  const { testCases, framework, coverageScore, tokensUsed, suggestions } =
    results;

  const positive = testCases.filter((t) => t.type === "POSITIVE").length;
  const negative = testCases.filter((t) => t.type === "NEGATIVE").length;
  const edge = testCases.filter((t) => t.type === "EDGE").length;

  return (
    <div className={s.wrap} id="test-output">
      {/* Results header */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <h2 className={s.count}>{testCases.length} test cases</h2>
          <p className={s.meta}>
            {framework}
            {tokensUsed > 0 && ` · ${tokensUsed} tokens`}
          </p>
          <div className={s.typePills}>
            {positive > 0 && (
              <span className={s.pillGreen}> {positive} positive</span>
            )}
            {negative > 0 && (
              <span className={s.pillRed}>✗ {negative} negative</span>
            )}
            {edge > 0 && <span className={s.pillOrange}>◈ {edge} edge</span>}
          </div>
        </div>
        <div className={s.scoreWrap}>
          <div
            className={s.scoreCircle}
            style={{
              "--pct": `${coverageScore}%`,
              "--color":
                coverageScore >= 80
                  ? "#4ade80"
                  : coverageScore >= 60
                    ? "#fb923c"
                    : "#f87171",
            }}
          >
            <span className={s.scoreNum}>{coverageScore}%</span>
            <span className={s.scoreLbl}>coverage</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className={s.cards}>
        {testCases.map((tc, i) => (
          <TestCaseCard key={tc.id || i} tc={tc} index={i} />
        ))}
      </div>

      {/* Suggestions */}
      {suggestions?.length > 0 && (
        <div className={s.suggestions}>
          <h3 className={s.sugTitle}>💡 Suggestions</h3>
          <div className={s.sugList}>
            {suggestions.map((sg, i) => (
              <div key={i} className={s.sugItem}>
                <span className={s.sugIcon}>
                  {sg.iconType === "warn"
                    ? "⚠️"
                    : sg.iconType === "success"
                      ? "✅"
                      : "ℹ️"}
                </span>
                <div>
                  <p className={s.sugItemTitle}>{sg.title}</p>
                  <p className={s.sugItemDesc}>{sg.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ExportBar
        testCases={testCases}
        project={project}
        framework={framework}
      />
    </div>
  );
}
