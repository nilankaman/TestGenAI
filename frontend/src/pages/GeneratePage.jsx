import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ExportBar from "@/components/ui/ExportBar";
import s from "./GeneratePage.module.css";

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

export default function GeneratePage() {
  const location = useLocation();

  // 1. Unified State Management
  const [tab, setTab] = useState(location.state?.tab || "manual");
  const [desc, setDesc] = useState(location.state?.desc || ""); 
  const [framework, setFramework] = useState("junit5");
  const [scriptFw, setScriptFw] = useState(location.state?.fw || "selenium");
  const [coverage, setCoverage] = useState("ALL");
  const [format, setFormat] = useState("CODE");

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Logic: API Handler
  const handleGenerate = async () => {
    if (!desc.trim()) {
      setError("Please describe the feature first.");
      return;
    }

    setError("");
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featureDescription: desc,
          framework: tab === "automation" ? framework : "plain",
          outputFormat: tab === "manual" ? "PLAIN" : format,
          coverageType: coverage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Server error occurred");
      }

      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.left}>
        <h1 className={s.title}>TestGen AI</h1>
        
        {/* Tab Selection */}
        <div className={s.modeTabs}>
          {["manual", "automation", "script"].map((t) => (
            <button
              key={t}
              className={`${s.modeTab} ${tab === t ? s.modeTabOn : ""}`}
              onClick={() => {
                setTab(t);
                setResults(null); // Clear results when switching modes
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Input Field - FIXED: value matches state variable 'desc' */}
        <div className={s.field}>
          <label className={s.lbl}>Feature Description</label>
          <textarea
            className={s.textarea}
            value={desc} 
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe your feature logic here..."
            rows={6}
          />
        </div>

        {/* Framework Picker - Only shows for Automation/Script */}
        {(tab === "automation" || tab === "script") && (
          <div className={s.field}>
            <label className={s.lbl}>Target Framework</label>
            <div className={s.frameworks}>
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  className={`${s.fwBtn} ${(tab === "automation" ? framework : scriptFw) === fw.id ? s.fwBtnOn : ""}`}
                  onClick={() => tab === "automation" ? setFramework(fw.id) : setScriptFw(fw.id)}
                >
                  {fw.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p className={s.errorMessage}>{error}</p>}

        <button
          className={s.generateBtn}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Processing..." : `Generate ${tab} cases`}
        </button>
      </div>

      <div className={s.right}>
        {results ? (
           <div className={s.resultsWrapper}>
              {/* Render your results here */}
              <pre>{JSON.stringify(results, null, 2)}</pre>
           </div>
        ) : (
          <div className={s.emptyState}>
            <p>Input a feature description to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}