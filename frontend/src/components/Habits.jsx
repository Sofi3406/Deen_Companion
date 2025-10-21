import React, { useEffect, useState } from "react";
import axios from "axios";

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(false);

  // Get habits on mount
  useEffect(() => {
    axios.get("/api/activities/habit")
      .then(res => setHabits(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add habit
  const addHabit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/activities/habit", { name: newHabit });
      setHabits(prev => [...prev, res.data]);
      setNewHabit("");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add habit");
    }
    setLoading(false);
  };

  // Update habit as done/not done
  const toggleHabit = async habit => {
    try {
      await axios.put(`/api/activities/habit/${habit._id}/status`, { done: !habit.done });
      setHabits(habits.map(h => h._id === habit._id ? { ...h, done: !h.done } : h));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Daily Habits</h2>
      <form onSubmit={addHabit} className="mb-4 flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="New habit"
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          required
        />
        <button className="bg-indigo-600 text-white px-3 py-1 rounded" type="submit" disabled={loading}>
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {habits.map(habit => (
          <li key={habit._id} className="flex justify-between items-center border-b py-2">
            <span>{habit.name}</span>
            <button
              className={`text-sm rounded px-3 py-1 ${habit.done ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"}`}
              onClick={() => toggleHabit(habit)}
            >
              {habit.done ? "Done" : "Mark Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Habits;
