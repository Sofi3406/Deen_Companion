import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler   
} from "chart.js";

// Register required Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler   
);

const motivationalMessage = (
  <div className="mb-6 text-center">
    <h2 className="text-2xl font-bold text-blue-700 mb-2">
      Keep Growing Your Imaan! 🌟
    </h2>
    <p className="text-lg text-gray-700">
      Every act of worship brings you closer to peace, purpose, and reward.  
      Stay consistent and watch your Imaan soar—Allah is with those who strive!
    </p>
  </div>
);

export default function ImaanChart({ points }) {
  const weeklyPoints = points?.length ? points : [10, 20, 15, 25, 30, 35, 40];
  const latestGain =
    weeklyPoints.length > 1 &&
    weeklyPoints[weeklyPoints.length - 1] > weeklyPoints[weeklyPoints.length - 2];

  const data = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Imaan Points",
        data: weeklyPoints,
        fill: true, // ✅ enabled now that Filler is registered
        borderColor: "#16a34a",
        pointBackgroundColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#2563eb", font: { size: 16, weight: "bold" } },
      },
      title: {
        display: true,
        text: "Weekly Imaan Progress",
        color: "#164e63",
        font: { size: 20, weight: "bold" },
      },
      tooltip: { mode: "index", intersect: false },
    },
    hover: { mode: "nearest", intersect: true },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#e0e7ef" },
        ticks: { color: "#0369a1", font: { size: 15 } },
      },
      x: {
        grid: { color: "#e0e7ef" },
        ticks: { color: "#0369a1", font: { size: 15 } },
      },
    },
  };

  return (
    <div className="mt-12 max-w-xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-green-100 rounded-xl shadow-lg">
      {motivationalMessage}
      <div className="mb-2 text-center">
        {latestGain ? (
          <span className="text-green-700 font-semibold text-lg">
            🚀 Amazing! Your Imaan is climbing!
          </span>
        ) : (
          <span className="text-blue-500 text-base font-medium">
            Each little step counts. 🙏
          </span>
        )}
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
