import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function PrayerTracker() {
  const [prayerTimes, setPrayerTimes] = useState(null); // Holds prayer times (Fajr, Dhuhr...)
  const [prayedStatus, setPrayedStatus] = useState(null); // Holds user’s completion status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch prayer times + completion status
  useEffect(() => {
    const fetchPrayers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiClient.get("/prayers/today");
        if (res.data && typeof res.data === "object") {
          setPrayerTimes(res.data.times);
          setPrayedStatus(res.data.prayed);
        } else {
          setPrayerTimes({ Fajr: "-", Dhuhr: "-", Asr: "-", Maghrib: "-", Isha: "-" });
          setPrayedStatus({ Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false });
        }
      } catch (err) {
        setError("Failed to load today's prayers.");
        setPrayerTimes({ Fajr: "-", Dhuhr: "-", Asr: "-", Maghrib: "-", Isha: "-" });
        setPrayedStatus({ Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrayers();
  }, []);

  // Toggle and persist prayed status
  const togglePrayer = async (prayerName) => {
    if (!prayedStatus) return;
    const updated = { ...prayedStatus, [prayerName]: !prayedStatus[prayerName] };
    setPrayedStatus(updated);
    setSaving(true);
    try {
      await apiClient.put("/prayers/today", { prayers: updated });
      setError("");
    } catch (err) {
      setError("Could not update prayer status.");
      setPrayedStatus(prayedStatus); // Optionally rollback/cancel if needed
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-6">Loading prayers...</p>;
  if (error) return <p className="text-red-500 text-center py-6">{error}</p>;
  if (!prayerTimes || !prayedStatus)
    return <p className="text-center text-gray-500 py-4">No prayer data found.</p>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Prayer Tracker</h2>
      <ul className="space-y-4">
        {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((name) => (
          <li key={name} className="flex items-center justify-between">
            <div>
              <span className="capitalize font-medium">{name}</span>
              <span className="ml-4 text-gray-600 text-sm">
                {prayerTimes[name] ? `@ ${prayerTimes[name]}` : ""}
              </span>
            </div>
            <button
              onClick={() => togglePrayer(name)}
              className={`px-4 py-2 rounded ${prayedStatus[name] ? "bg-green-500 text-white" : "bg-gray-300"} ${
                saving ? "opacity-50 pointer-events-none" : ""
              }`}
              disabled={saving}
            >
              {prayedStatus[name] ? "Completed" : "Not Done"}
            </button>
          </li>
        ))}
      </ul>
      {saving && <p className="text-blue-500 mt-2 text-center">Saving...</p>}
    </div>
  );
}
