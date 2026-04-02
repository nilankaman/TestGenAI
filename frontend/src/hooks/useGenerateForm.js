import { useState } from "react";
import { generateTestCases } from "@/services/generateService";

const DEFAULT_STATE = {
  description: "",
  framework: "junit5",
  coverage: "ALL",
  format: "CODE",
  language: "en",
  projectId: "",
};

export function useGenerateForm() {
  const [form, setForm] = useState(DEFAULT_STATE);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    if (!form.description.trim()) {
      setError("Please describe the feature you want to test.");
      return;
    }

    setError("");
    setLoading(true);
    setResults(null);

    try {
      const data = await generateTestCases(form);
      setResults(data);
    } catch (e) {
      setError(e.message || "Generation failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setForm(DEFAULT_STATE);
    setResults(null);
    setError("");
  }

  return { form, setField, results, loading, error, submit, reset };
}
