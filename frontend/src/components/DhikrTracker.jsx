import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

export default function DhikrTracker() {
  const [morningCount, setMorningCount] = useState(0);
  const [eveningCount, setEveningCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDhikr = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/dhikr");
        setRecords(res.data);
        setError("");
      } catch {
        setError("Failed to load Dhikr data");
      } finally {
        setLoading(false);
      }
    };
    fetchDhikr();
  }, []);

  const submitDhikr = async () => {
    if (morningCount === 0 && eveningCount === 0) return;
    setSubmitting(true);
    try {
      await apiClient.post("/dhikr", { morningCount, eveningCount });
      setMorningCount(0);
      setEveningCount(0);
      setError("");
      const res = await apiClient.get("/dhikr");
      setRecords(res.data);
    } catch {
      setError("Failed to submit Dhikr counts");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl p-6 bg-white rounded shadow mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Dhikr Tracker</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="mb-2 text-gray-600">Loading data...</p>}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Morning Dhikr Count</label>
        <input
          type="number"
          min="0"
          value={morningCount}
          onChange={(e) => setMorningCount(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Evening Dhikr Count</label>
        <input
          type="number"
          min="0"
          value={eveningCount}
          onChange={(e) => setEveningCount(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={submitDhikr}
        disabled={submitting || (morningCount === 0 && eveningCount === 0)}
        className={`w-full p-2 rounded text-white ${
          submitting || (morningCount === 0 && eveningCount === 0)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {submitting ? "Saving..." : "Save"}
      </button>

      <h3 className="text-xl font-semibold mt-8 mb-3">Recent Dhikr Records</h3>
      {records.length === 0 && !loading && <p className="text-gray-600">No records found.</p>}
      <ul>
        {records.map((record) => (
          <li key={record._id} className="mb-2 p-3 bg-gray-50 rounded shadow-sm">
            <div>
              <strong>Date:</strong>{" "}
              {new Date(record.date).toLocaleDateString(undefined, { timeZoneName: "short" })}
            </div>
            <div>
              <strong>Morning:</strong> {record.morningCount}
            </div>
            <div>
              <strong>Evening:</strong> {record.eveningCount}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
