import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import ImaanChart from "./ImaanChart";

export default function Dashboard() {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [prayersRes, pointsRes] = await Promise.all([
          apiClient.get("/prayers/today"),
          apiClient.get("/imaan/weeklypoints"),
        ]);
        // Defensive assignment; only set if times is a non-null object
        setPrayerTimes(
          prayersRes.data && typeof prayersRes.data.times === "object" && prayersRes.data.times !== null
            ? prayersRes.data.times
            : {}
        );
        setPoints(pointsRes.data || []);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-6 max-w-5xl mx-auto text-center text-gray-600">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="p-6 max-w-5xl mx-auto text-center text-red-600 font-semibold">
        {error}
      </div>
    );

  // Robust: always pass an object to Object.entries
  const prayerEntries = Object.entries(prayerTimes ?? {});

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">
        Welcome to Your Dashboard
      </h1>
      <p className="text-center mb-12 text-indigo-700 text-lg font-medium">
        Track your prayers, Imaan points, and spiritual progress
      </p>

      <section className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-indigo-50 rounded-lg p-6 shadow-inner">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800 border-b border-indigo-200 pb-2">
            Today's Prayer Times
          </h2>
          {prayerEntries.length === 0 ? (
            <p className="text-gray-600">No prayer times available</p>
          ) : (
            <ul className="space-y-3 text-indigo-900 font-semibold">
              {prayerEntries.map(([name, time]) => (
                <li
                  key={name}
                  className="flex justify-between border-b border-indigo-100 pb-1 last:border-none"
                >
                  <span>{name}</span>
                  <span>{time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-indigo-50 rounded-lg p-6 shadow-inner md:col-span-2">
          <ImaanChart points={points} />
        </div>
      </section>

      <footer className="text-center text-indigo-400 text-sm">
        Deen Companion &copy; 2025
      </footer>
    </div>
  );
}
