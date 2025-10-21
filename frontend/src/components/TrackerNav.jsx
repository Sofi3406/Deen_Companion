import { NavLink } from "react-router-dom";

const links = [
 { to: "/welcome", label: "Welcome" },
  { to: "/prayers", label: "Prayer Tracker" },
  { to: "/worship-log", label: "Worship Log" },      
  { to: "/quran", label: "Quran Tracker" },
  { to: "/dhikr", label: "Dhikr Tracker" },
  { to: "/habits", label: "Habit Tracker" },
  { to: "/achievements", label: "Achievements" },   
  { to: "/charity", label: "Imaan Charity" },
  { to: "/reminders", label: "Reminders" },
];

export default function TrackerNav() {
  const activeClass = "font-bold underline text-indigo-700";
  const baseClass = "px-3 py-2 rounded hover:bg-indigo-100";

  return (
    <nav className="bg-white shadow rounded p-4 mb-6 flex flex-wrap gap-3">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            isActive ? `${baseClass} ${activeClass}` : baseClass
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
