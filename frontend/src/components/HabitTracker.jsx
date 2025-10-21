import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [habitInput, setHabitInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/activities/habit");
        setHabits(res.data);
        setError("");
      } catch {
        setError("Failed to load habits");
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  const addHabit = async (e) => {
    e.preventDefault();
    if (habitInput.trim() === "") return;
    try {
      const res = await apiClient.post("/activities/habit", { habitName: habitInput });
      setHabits([...habits, res.data]);
      setHabitInput("");
      setError("");
    } catch {
      setError("Failed to add habit");
    }
  };

  const toggleDone = async (id, done) => {
    try {
      const res = await apiClient.put(`/activities/habit/${id}/status`, { done: !done });
      setHabits(habits.map((h) => (h._id === id ? res.data : h)));
      setError("");
    } catch {
      setError("Failed to update habit");
    }
  };

  // Delete habit
  const deleteHabit = async (id) => {
    try {
      await apiClient.delete(`/activities/habit/${id}`);
      setHabits(habits.filter(h => h._id !== id));
    } catch {
      setError("Failed to delete habit");
    }
  };

  // Start editing
  const startEdit = (habit) => {
    setEditingId(habit._id);
    setEditingName(habit.habitName || habit.name);
  };

  // Save edit
  const saveEdit = async (id) => {
    if (!editingName.trim()) return;
    try {
      const res = await apiClient.put(`/activities/habit/${id}`, { habitName: editingName });
      setHabits(habits.map(h => h._id === id ? res.data : h));
      setEditingId(null);
      setEditingName("");
    } catch {
      setError("Failed to update habit name");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Habit Tracker</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="mb-2 text-gray-600">Loading habits...</p>}

      <form onSubmit={addHabit} className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new good habit"
          value={habitInput}
          onChange={(e) => setHabitInput(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          aria-label="Habit Name"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700"
        >
          Add
        </button>
      </form>

      {habits.length === 0 && !loading && (
        <p className="text-gray-600">No habits yet. Start by adding one!</p>
      )}

      <ul>
        {habits.map((habit) => (
          <li
            key={habit._id}
            className={`p-3 mb-2 rounded flex justify-between items-center select-none
              ${habit.done ? "bg-green-200 line-through" : "bg-gray-100"}
            `}
          >
            <div className="flex-1" onClick={() => toggleDone(habit._id, habit.done)}>
              {editingId === habit._id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="p-2 border rounded w-full"
                  autoFocus
                  onBlur={() => saveEdit(habit._id)}
                  onKeyDown={e => {
                    if (e.key === "Enter") saveEdit(habit._id);
                    if (e.key === "Escape") {
                      setEditingId(null); setEditingName("");
                    }
                  }}
                />
              ) : (
                <span role="button" tabIndex={0}>{habit.habitName || habit.name}</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                className="text-blue-600 px-2 py-1 text-xs rounded hover:underline"
                onClick={() => startEdit(habit)}
                disabled={editingId === habit._id}
              >
                Edit
              </button>
              <button
                className="text-red-600 px-2 py-1 text-xs rounded hover:underline"
                onClick={() => deleteHabit(habit._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
