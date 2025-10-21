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
  const activeClass = "font-bold underline text-indigo-700 bg-indigo-50";
  const baseClass = "px-4 py-3 rounded hover:bg-indigo-100 block transition-all text-left";

  return (
    <aside className="bg-white shadow min-h-screen rounded-r-md p-4 flex flex-col gap-2 w-56">
      <div className="text-xl font-bold text-indigo-700 mb-6 px-2">Deen Companion</div>
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
    </aside>
  );
}
