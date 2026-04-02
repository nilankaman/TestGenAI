import { useState } from "react";

// Module-level state so it persists across component re-renders
let lastResults = null;
let lastDesc = "";

export default function useGenerateStore() {
  const [results, setResults] = useState(lastResults);
  const [desc, setDesc] = useState(lastDesc);

  function saveResults(data, description) {
    lastResults = data;
    lastDesc = description;
    setResults(data);
    setDesc(description);
  }

  function clearResults() {
    lastResults = null;
    lastDesc = "";
    setResults(null);
    setDesc("");
  }

  return { results, desc, saveResults, clearResults };
}
