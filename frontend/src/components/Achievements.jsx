import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient"; 

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    unlocked: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get achievements for authenticated user
  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/achievements")
      .then(res => setAchievements(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.msg || "Failed to load achievements");
      })
      .finally(() => setLoading(false));
  }, []);

  // Add new achievement
  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post("/achievements", newAchievement);
      if (res.data?.achievement) {
        setAchievements(prev => [...prev, res.data.achievement]);
        setNewAchievement({ title: "", description: "", unlocked: false });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Error adding achievement");
    } finally {
      setLoading(false);
    }
  };

  // Unlock/lock achievement by title
  const handleUnlock = async (title, unlocked) => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.patch(
        `/achievements/${encodeURIComponent(title)}`,
        { unlocked: !unlocked }
      );
      if (res.data?.achievement) {
        setAchievements(prev =>
          prev.map(a => (a.title === title ? res.data.achievement : a))
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Failed to update achievement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Achievements</h2>

      <form onSubmit={handleAdd} className="mb-4 space-y-2">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={newAchievement.title}
          onChange={e => setNewAchievement({ ...newAchievement, title: e.target.value })}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={newAchievement.description}
          onChange={e => setNewAchievement({ ...newAchievement, description: e.target.value })}
          required
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={newAchievement.unlocked}
            onChange={e =>
              setNewAchievement({ ...newAchievement, unlocked: e.target.checked })
            }
          />{" "}
          <span className="ml-2">Unlocked?</span>
        </label>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Achievement"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      <ul className="space-y-3">
        {Array.isArray(achievements) && achievements.length > 0 ? (
          achievements.map(a => (
            <li
              key={a.title}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <span className="font-semibold">{a.title}</span>: {a.description}
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded ${
                    a.unlocked
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {a.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
              <button
                className="text-sm text-indigo-600"
                disabled={loading}
                onClick={() => handleUnlock(a.title, a.unlocked)}
              >
                {a.unlocked ? "Lock" : "Unlock"}
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No achievements yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Achievements;
