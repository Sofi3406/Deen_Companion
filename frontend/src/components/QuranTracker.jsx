import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

export default function QuranTracker() {
  const [progress, setProgress] = useState([]);
  const [pagesRead, setPagesRead] = useState(0);
  const [surahInput, setSurahInput] = useState("");
  const [dailyVerse, setDailyVerse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [progressRes, verseRes] = await Promise.all([
          apiClient.get("/quran/progress"),
          apiClient.get("/quran/dailyverse"),
        ]);
        setProgress(progressRes.data);
        setDailyVerse(verseRes.data.chapter);
        setError("");
      } catch {
        setError("Failed to load Quran data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addProgress = async () => {
    if (pagesRead <= 0) {
      setError("Please enter number of pages read");
      return;
    }
    setSubmitting(true);
    try {
      const surahs = surahInput.trim() ? [surahInput.trim()] : [];
      const res = await apiClient.post("/quran/progress", { pagesRead, surahsRead: surahs });
      setProgress([res.data, ...progress]);
      setPagesRead(0);
      setSurahInput("");
      setError("");
    } catch {
      setError("Failed to save progress");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Quran Tracker</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="mb-4 text-gray-600">Loading Quran progress and daily verse...</p>}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Pages Read Today</label>
        <input
          type="number"
          value={pagesRead}
          onChange={(e) => setPagesRead(Number(e.target.value))}
          className="w-full p-2 border rounded"
          min="0"
          disabled={submitting}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Surah Read (optional)</label>
        <input
          type="text"
          placeholder="Surah Name or Number"
          value={surahInput}
          onChange={(e) => setSurahInput(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={submitting}
        />
      </div>

      <button
        onClick={addProgress}
        disabled={submitting || pagesRead <= 0}
        className={`w-full py-2 rounded text-white ${
          submitting || pagesRead <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {submitting ? "Saving..." : "Add Progress"}
      </button>

      {dailyVerse && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Daily Quran Chapter</h3>
          <p>
            <strong>{dailyVerse.name_arabic}</strong> - {dailyVerse.transliterated_name}
          </p>
          <p>{dailyVerse.english_name_translation}</p>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-8 mb-3">Recent Progress</h3>
      {progress.length === 0 && !loading ? (
        <p className="text-gray-600">No progress recorded yet.</p>
      ) : (
        <ul>
          {progress.map((entry) => (
            <li key={entry._id} className="mb-2 p-3 bg-gray-50 rounded shadow-sm">
              <div>
                <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}
              </div>
              <div>
                <strong>Pages Read:</strong> {entry.pagesRead}
              </div>
              <div>
                <strong>Surahs Read:</strong>{" "}
                {entry.surahsRead.length ? entry.surahsRead.join(", ") : "-"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
