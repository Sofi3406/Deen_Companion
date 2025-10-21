import { NavLink } from "react-router-dom";

export default function Nav() {
  const token = localStorage.getItem("token");

  const baseClass = "hover:underline";
  const activeClass = "font-semibold underline text-emerald-300";

  return (
    <nav className="bg-indigo-700 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Deen Companion</h1>
        <ul className="flex space-x-6 text-white font-semibold">
          {token ? (
            <>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? `${baseClass} ${activeClass}` : baseClass)}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <button
                  className={`${baseClass} hover:underline`}
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? `${baseClass} ${activeClass}` : baseClass)}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? `${baseClass} ${activeClass}` : baseClass)}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) => (isActive ? `${baseClass} ${activeClass}` : baseClass)}
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
