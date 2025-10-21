import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import ImaanChart from "./ImaanChart"; // Your beautified chart component

const trackerEndpoints = {
  prayers: "/prayers/weekly",        // Expects array of { date, Fajr, Dhuhr, ... }
  worship: "/worship/weekly",        // Expects array of { date, ...worship acts }
  quran: "/quran/weekly",            // Expects array of { date, amount/pages/ayahs }
  dhikr: "/dhikr/weekly",            // Expects array of { date, count }
  habits: "/activities/habit/weekly" // Expects array of { date, ...habit fields }
};

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ImaanDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weeklyPoints, setWeeklyPoints] = useState([]);
  const [details, setDetails] = useState({
    prayers: [], worship: [], quran: [], dhikr: [], habits: []
  });

  // Helper: Convert weekday index from a date
  function getWeekdayIndex(dateStr) {
    return new Date(dateStr).getDay(); // 0=Sun, ... 6=Sat
  }

  // Calculate “Imaan Points” for each day by summing acts across trackers
  function calculatePoints(data) {
    const dayPoints = Array(7).fill(0);
    // Example scoring logic (customize as you want)
    data.prayers.forEach(day => {
      // +10 per prayer marked true
      ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach(p => {
        if (day[p]) dayPoints[getWeekdayIndex(day.date)] += 10;
      });
    });
    data.worship.forEach(day => {
      Object.values(day).forEach(v => { if (typeof v === "boolean" && v) dayPoints[getWeekdayIndex(day.date)] += 5; });
    });
    data.quran.forEach(day => {
      if (day.amount && day.amount > 0) dayPoints[getWeekdayIndex(day.date)] += Math.min(day.amount, 20); // e.g. max 20 per day
    });
    data.dhikr.forEach(day => {
      if (day.count) dayPoints[getWeekdayIndex(day.date)] += Math.min(day.count / 100, 10); // +1 per 100 dhikr, max 10
    });
    data.habits.forEach(day => {
      // Example: +5 for each positive habit per day
      Object.values(day).forEach(v => { if (typeof v === "boolean" && v) dayPoints[getWeekdayIndex(day.date)] += 5; });
    });
    return dayPoints;
  }

  // Fetch weekly tracker data from all endpoints
  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      setError("");
      try {
        const results = await Promise.all(
          Object.entries(trackerEndpoints).map(async ([key, url]) => {
            const res = await apiClient.get(url);
            return [key, Array.isArray(res.data) ? res.data : []];
          })
        );
        const structured = Object.fromEntries(results);
        setDetails(structured);
        setWeeklyPoints(calculatePoints(structured));
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading your Imaan Dashboard...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // Gather stats for info cards
  const prayersDone = details.prayers.flatMap(d =>
    ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(p => d[p] ? 1 : 0)
  ).reduce((a, b) => a + b, 0);
  const quranPages = details.quran.reduce((a, b) => a + (b.amount || 0), 0);
  const dhikrCount = details.dhikr.reduce((a, b) => a + (b.count || 0), 0);
  const habitDays = details.habits.length; // or sum habit events

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-1">
          Your Imaan Growth Dashboard 🚀
        </h2>
        <p className="text-lg text-gray-700">
          Every prayer, page, and positive habit makes a difference.<br />
          Keep striving and watch your spirit shine, one day at a time!
        </p>
      </div>
      <ImaanChart points={weeklyPoints} />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg text-blue-700 text-center">
          <div className="font-bold text-lg">{prayersDone}</div>
          <div>Prayers Completed</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg text-green-700 text-center">
          <div className="font-bold text-lg">{quranPages}</div>
          <div>Qur’an Pages Read</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg text-yellow-700 text-center">
          <div className="font-bold text-lg">{dhikrCount}</div>
          <div>Dhikr Recited</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg text-purple-800 text-center">
          <div className="font-bold text-lg">{habitDays}</div>
          <div>Habit Days Tracked</div>
        </div>
      </div>
      <div className="mt-8 text-center text-xl text-green-600 font-semibold">
        {weeklyPoints[weeklyPoints.length - 1] > (weeklyPoints[weeklyPoints.length - 2] || 0)
          ? "🌟 Great progress! Your Imaan is rising!"
          : "Keep going – consistency is key. You’ve got this!"}
      </div>
    </div>
  );
}
