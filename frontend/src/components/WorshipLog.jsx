import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient"; // Adjust path if needed!

const worshipActsTemplate = [
  { key: "Fajr", label: "Fajr Prayer", points: 10 },
  { key: "Dhuhr", label: "Dhuhr Prayer", points: 10 },
  { key: "Asr", label: "Asr Prayer", points: 10 },
  { key: "Maghrib", label: "Maghrib Prayer", points: 10 },
  { key: "Isha", label: "Isha Prayer", points: 10 },
  { key: "Quran", label: "Qur’an Reading", points: 20 },
  { key: "Dhikr", label: "Dhikr", points: 10 },
  { key: "SunnahDuha", label: "Sunnah (Duha)", points: 10 },
  { key: "FastingMonday", label: "Fasting (Monday)", points: 30 },
];

const WorshipLog = () => {
  const [status, setStatus] = useState(
    worshipActsTemplate.reduce((acc, { key }) => ({ ...acc, [key]: false }), {})
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load today's worship log on mount
  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/worship/today")
      .then((res) => {
        if (res.data && typeof res.data.worship === "object") {
          setStatus((prev) => ({ ...prev, ...res.data.worship }));
        }
      })
      .catch(() => setError("Could not load today's worship log"))
      .finally(() => setLoading(false));
  }, []);

  // Submit today's acts
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiClient.put("/worship/today", { worship: status });
      alert("Today's worship log updated!");
    } catch (err) {
      setError("Failed to update worship log");
    } finally {
      setSaving(false);
    }
  };

  // Toggle status for an act
  const toggleStatus = (key) => {
    setStatus((s) => ({ ...s, [key]: !s[key] }));
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <form className="max-w-lg mx-auto p-6 bg-white rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Today's Worship Tracker</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2 mb-4">
        {worshipActsTemplate.map(({ key, label, points }) => (
          <li key={key} className="flex items-center justify-between">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={!!status[key]}
                onChange={() => toggleStatus(key)}
                className="accent-green-500"
                disabled={saving}
              />
              <span>
                {label} ({points} pts)
              </span>
            </label>
          </li>
        ))}
      </ul>
      <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Worship Log"}
      </button>
    </form>
  );
};

export default WorshipLog;
