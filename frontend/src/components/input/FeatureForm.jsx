import React from "react";
import s from "./FeatureForm.module.css";

const FRAMEWORKS = [
  { id: "junit5", label: "JUnit5", lang: "Java" },
  { id: "testng", label: "TestNG", lang: "Java" },
  { id: "selenium", label: "Selenium", lang: "Java" },
  { id: "appium", label: "Appium", lang: "Java" },
  { id: "restassured", label: "RestAssured", lang: "Java" },
  { id: "cypress", label: "Cypress", lang: "JS" },
  { id: "playwright", label: "Playwright", lang: "JS/TS" },
  { id: "cucumber", label: "Cucumber/BDD", lang: "BDD" },
  { id: "pytest", label: "Pytest", lang: "Python" },
  { id: "jest", label: "Jest", lang: "JS" },
];

export default function FeatureForm({
  description,
  framework,
  coverage,
  format,
  onDescChange,
  onFrameworkChange,
  onCoverageChange,
  onFormatChange,
  onSubmit,
  loading,
  error,
  showFramework = true,
  placeholder = "e.g. User login with email and password...",
}) {
  return (
    <div className={s.form}>
      <div className={s.field}>
        <label className={s.label}>Feature description</label>
        <textarea
          className={s.textarea}
          value={description}
          onChange={(e) => onDescChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
        />
      </div>

      {showFramework && (
        <div className={s.field}>
          <label className={s.label}>Framework</label>
          <div className={s.frameworks}>
            {FRAMEWORKS.map((fw) => (
              <button
                key={fw.id}
                type="button"
                className={`${s.fwBtn} ${framework === fw.id ? s.fwBtnOn : ""}`}
                onClick={() => onFrameworkChange(fw.id)}
              >
                <span className={s.fwLabel}>{fw.label}</span>
                <span className={s.fwLang}>{fw.lang}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={s.row}>
        <div className={s.field}>
          <label className={s.label}>Coverage</label>
          <select
            className={s.select}
            value={coverage}
            onChange={(e) => onCoverageChange(e.target.value)}
          >
            <option value="ALL">All types</option>
            <option value="POSITIVE">Positive only</option>
            <option value="NEGATIVE">Negative only</option>
            <option value="EDGE">Edge cases</option>
          </select>
        </div>
        <div className={s.field}>
          <label className={s.label}>Format</label>
          <select
            className={s.select}
            value={format}
            onChange={(e) => onFormatChange(e.target.value)}
          >
            <option value="CODE">Code</option>
            <option value="GHERKIN">Gherkin</option>
            <option value="PLAIN">Plain text</option>
          </select>
        </div>
      </div>

      {error && <div className={s.error}>{error}</div>}

      <button
        className={s.submitBtn}
        onClick={onSubmit}
        disabled={loading}
        type="button"
      >
        {loading ? (
          <>
            <span className={s.spinner} /> Generating…
          </>
        ) : (
          "⚡ Generate test cases"
        )}
      </button>
    </div>
  );
}
