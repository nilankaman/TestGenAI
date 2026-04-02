import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";
import toast from "react-hot-toast";
import styles from "./SettingsPage.module.css";

const PROVIDERS = [
  { id: "huggingface", label: "HuggingFace Inference API" },
  { id: "Groq", label: "Groq API" },
  { id: "openai", label: "OpenAI Compatible" },
  { id: "anthropic", label: "Anthropic Claude" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "hi", label: "हिंदी" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국어" },
];

export default function SettingsPage() {
  const { t } = useTranslation();
  const [provider, setProvider] = useState("Groq API");
  const [lang, setLang] = useState(i18n.language);

  function save() {
    i18n.changeLanguage(lang);
    localStorage.setItem("testgen-lang", lang);
    toast.success(t("Saved") + " ");
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t("")}</h1>
        <p className={styles.pageSub}>{t("")}</p>
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("API Provider")}</h2>
          <div className={styles.providerList}>
            {PROVIDERS.map((p) => (
              <label
                key={p.id}
                className={`${styles.providerCard} ${provider === p.id ? styles.providerActive : ""}`}
              >
                <input
                  type="radio"
                  name="provider"
                  value={p.id}
                  checked={provider === p.id}
                  onChange={() => setProvider(p.id)}
                  className={styles.radioHidden}
                />
                <div className={styles.radioCircle} />
                <div>
                  <p className={styles.providerLabel}>{p.label}</p>
                  <p className={styles.providerDesc}>{p.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <p className={styles.note}>
            Note: AI provider is configured server-side via{" "}
            <code>ai.provider</code> in application.properties. This setting is
            for display only until Phase 4 (admin panel).
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t("Language")}</h2>
          <div className={styles.langGrid}>
            {LANGUAGES.map((l) => (
              <label
                key={l.code}
                className={`${styles.langCard} ${lang === l.code ? styles.langActive : ""}`}
              >
                <input
                  type="radio"
                  name="lang"
                  value={l.code}
                  checked={lang === l.code}
                  onChange={() => setLang(l.code)}
                  className={styles.radioHidden}
                />
                {l.label}
              </label>
            ))}
          </div>
        </section>

        <button className={styles.saveBtn} onClick={save}>
          {t("Save")}
        </button>
      </div>
    </div>
  );
}
