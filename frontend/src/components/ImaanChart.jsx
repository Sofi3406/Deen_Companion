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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ImaanChart({ points }) {
  const data = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Imaan Points",
        data: points?.length ? points : [10, 20, 15, 25, 30, 35, 40],
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Weekly Imaan Points" },
      tooltip: { mode: "index", intersect: false },
    },
    hover: { mode: "nearest", intersect: true },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="mt-8 max-w-lg mx-auto p-4 bg-white rounded shadow">
      <Line data={data} options={options} />
    </div>
  );
}
