import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 flex flex-col">
      <header className="flex justify-between items-center p-6 bg-transparent max-w-6xl mx-auto w-full">
        <h1 className="text-white text-4xl font-extrabold tracking-wide">Deen Companion</h1>
        <nav>
          <ul className="flex space-x-8 text-white font-semibold text-lg">
            <li>
              <Link to="/login" className="hover:underline hover:text-indigo-300 transition">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:underline hover:text-indigo-300 transition">
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center text-center px-6 max-w-4xl mx-auto">
        <h2 className="text-white text-6xl font-extrabold mb-6 drop-shadow-lg leading-tight">
          Organize Your Islamic Life <br /> with Deen Companion
        </h2>
        <p className="text-indigo-300 text-xl max-w-xl mb-10 drop-shadow-md">
          Track your prayers, Quran reading, Dhikr & fasting; set good habits and grow your Imaan, all in one smart app designed to keep your spiritual goals on track.
        </p>
        <Link
          to="/register"
          className="inline-block bg-white text-indigo-800 font-extrabold px-12 py-4 rounded-xl shadow-lg hover:bg-indigo-100 hover:scale-105 transform transition"
          aria-label="Get Started with Deen Companion"
        >
          Get Started
        </Link>
      </main>

      <footer className="text-indigo-300 text-center p-6 bg-indigo-900 shadow-inner">
        &copy; {new Date().getFullYear()} Deen Companion. All rights reserved.
      </footer>
    </div>
  );
}
