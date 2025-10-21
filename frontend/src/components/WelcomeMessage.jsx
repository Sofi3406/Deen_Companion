import { useState, useEffect, useRef } from "react";
import apiClient from "../api/apiClient";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ProgressBar({ percent }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mt-2 mb-4 shadow-inner">
      <div
        className="h-4 bg-indigo-600 rounded-full transition-all duration-300"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}

export default function WelcomeDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({});
  const [worship, setWorship] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [progress, setProgress] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const [
          profileRes,
          worshipRes,
          achievementsRes,
          progressRes
        ] = await Promise.all([
          apiClient.get("/user/profile"),
          apiClient.get("/worship/today"),
          apiClient.get("/user/achievements"),
          apiClient.get("/imaan/weeklypoints")
        ]);
        setProfile(profileRes.data);
        setWorship(worshipRes.data);
        setAchievements(achievementsRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        setError("Failed to load dashboard. Try later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const {
    name,
    imanPoints = 0,
    level = "Student of Deen",
    badges = [],
    createdAt = ""
  } = profile;

  const userPoints = progress.points !== undefined ? progress.points : 0;
  const chartPoints = Array.isArray(progress.daily) && progress.daily.length ? progress.daily : [0, 10, 20, 10, 40, 15, 20];

  const worshipList = worship.length > 0 ? worship : [
    { name: "Fajr Prayer", status: true, points: 10 },
    { name: "Dhuhr Prayer", status: true, points: 10 },
    { name: "Asr Prayer", status: true, points: 10 },
    { name: "Maghrib Prayer", status: true, points: 10 },
    { name: "Isha Prayer", status: true, points: 10 },
    { name: "Qur’an Reading", status: true, points: 20 },
    { name: "Dhikr", status: true, points: 10 },
    { name: "Sunnah (Duha)", status: false, points: 0 },
    { name: "Fasting (Monday)", status: true, points: 30 }
  ];

  const totalToday = worshipList.reduce((acc, act) => acc + (act.points || 0), 0);
  const nextLevelPoints = 2000;
  const percent = Math.min(100, Math.round((imanPoints / nextLevelPoints) * 100));

  const chartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Imaan Points",
        data: chartPoints,
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Weekly Imaan Points" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 10 } },
    },
  };

  if (loading) return <div className="p-10 text-center text-gray-600">Loading dashboard...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
      <h2 className="text-3xl font-bold mb-1">
        Assalamu Alaikum, <span className="text-indigo-600">{name || "User"}!</span>
      </h2>
      <p className="mb-3">May Allah bless your efforts today</p>
      <h3 className="text-lg font-semibold mb-2">
        You’ve earned {imanPoints} Imaan Points this week!
      </h3>

      <section className="mb-6">
        <h4 className="font-bold mb-2">Daily Worship Summary</h4>
        <table className="w-full text-left bg-gray-50 rounded-lg mb-2 overflow-hidden">
          <thead>
            <tr className="bg-indigo-100 text-indigo-900">
              <th className="py-2 px-3">Act</th>
              <th>Status</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {worshipList.map((act) => (
              <tr key={act.name} className="border-b">
                <td className="py-1 px-3">{act.name}</td>
                <td className="py-1">{act.status ? "✅" : "❌"}</td>
                <td className="py-1">{act.points ? `+${act.points}` : "—"}</td>
              </tr>
            ))}
            <tr>
              <td className="py-1 px-3 font-bold">Total Today</td>
              <td></td>
              <td className="font-bold">+{totalToday}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-4">
        <h4 className="font-bold mb-1">Your Imaan Level</h4>
        <div>Level 2: {level}</div>
        <ProgressBar percent={percent} />
        <div className="mb-1 text-gray-800">Progress: {percent}%</div>
        <div className="text-gray-600 text-sm mb-2">Next Level: “Muhtasib” at {nextLevelPoints} points</div>
        <div className="text-emerald-700 font-medium mb-2">
          Keep it up! You’re close to your next level insha’Allah!
        </div>
      </section>

      <section className="mb-4">
        <h4 className="font-bold mb-2">Your Achievements</h4>
        <ul className="list-disc ml-6 text-gray-700">
          {achievements.length > 0
            ? achievements.map((a, i) => (
                <li key={i} className={a.unlocked ? "text-green-700" : "text-gray-500"}>
                  {a.unlocked ? "✅" : "🔒"} {a.title} – {a.description}
                </li>
              ))
            : [
                <li key="1">✅ 7-Day Salah Streak – Didn’t miss a prayer this week!</li>,
                <li key="2">📖 Qur’an Reader Badge – Read Qur’an 5 days in a row.</li>,
                <li key="3">🌙 Ramadan Hero (locked) – Complete all fasts in Ramadan.</li>,
              ]}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-bold mb-2">Motivational Hadith / Quote</h4>
        <blockquote className="bg-gray-100 p-3 rounded italic text-indigo-700">
          “The most beloved deeds to Allah are those done regularly, even if they are few.”
          <br />
          <span className="text-gray-600 text-sm">(Sahih Bukhari)</span>
        </blockquote>
      </section>

      <section className="mt-4">
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </section>
    </div>
  );
}
