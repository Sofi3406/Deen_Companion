import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ type: "prayer", time: "", message: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/reminders");
        setReminders(res.data);
        setError("");
      } catch {
        setError("Failed to load reminders");
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  const addReminder = async () => {
    if (!newReminder.time) {
      setError("Please select a time");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiClient.post("/reminders", newReminder);
      setReminders([...reminders, res.data]);
      setNewReminder({ type: "prayer", time: "", message: "" });
      setError("");
    } catch {
      setError("Failed to add reminder");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleEnabled = async (id, enabled) => {
    setReminders(reminders.map((r) => (r._id === id ? { ...r, enabled: !enabled } : r)));
    try {
      await apiClient.put(`/reminders/${id}`, { enabled: !enabled });
      setError("");
    } catch {
      setError("Failed to update reminder");
      setReminders(reminders.map((r) => (r._id === id ? { ...r, enabled } : r)));
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Smart Reminders</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="mb-2 text-gray-600">Loading reminders...</p>}

      <div className="mb-4">
        <label className="font-medium block mb-1">Type</label>
        <select
          value={newReminder.type}
          onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={submitting}
        >
          <option value="prayer">Prayer</option>
          <option value="sunnah">Sunnah</option>
          <option value="hadith">Hadith</option>
          <option value="quran">Quran</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="font-medium block mb-1">Time (HH:mm)</label>
        <input
          type="time"
          value={newReminder.time}
          onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={submitting}
        />
      </div>

      <div className="mb-4">
        <label className="font-medium block mb-1">Custom Message (optional)</label>
        <input
          type="text"
          value={newReminder.message}
          onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="E.g. Time for Fajr Prayer"
          disabled={submitting}
        />
      </div>

      <button
        onClick={addReminder}
        disabled={submitting || !newReminder.time}
        className={`w-full p-2 rounded text-white ${
          submitting || !newReminder.time ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        } mb-6`}
      >
        {submitting ? "Adding..." : "Add Reminder"}
      </button>

      <h3 className="text-xl font-semibold mb-3">Your Reminders</h3>
      {reminders.length === 0 && !loading ? (
        <p className="text-gray-600">No reminders set yet.</p>
      ) : (
        <ul>
          {reminders.map((reminder) => (
            <li
              key={reminder._id}
              className="p-3 mb-2 bg-gray-100 rounded flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>{reminder.type}</strong> at {reminder.time}
                </p>
                {reminder.message && <p className="italic text-sm">{reminder.message}</p>}
              </div>
              <button
                onClick={() => toggleEnabled(reminder._id, reminder.enabled)}
                className={`px-3 py-1 rounded text-white ${
                  reminder.enabled ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {reminder.enabled ? "Enabled" : "Disabled"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
