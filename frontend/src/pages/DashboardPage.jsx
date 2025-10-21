import Dashboard from "../components/Dashboard";
import WelcomeMessage from "../components/WelcomeMessage";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-10 flex justify-center items-start">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl border border-indigo-200 p-10">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-indigo-900 mb-4 tracking-wide">
            Welcome to Your Dashboard
          </h1>
          <p className="text-indigo-700 text-xl max-w-lg mx-auto">
            Track your prayers, Imaan points, badges earned, and spiritual progress
          </p>
        </header>

        {/* Personalized welcome message with badges and progress */}
        <section className="mb-12">
          <WelcomeMessage />
        </section>

        {/* Dashboard main contents */}
        <section className="mb-12">
          <Dashboard />
        </section>

        <footer className="mt-16 text-center text-sm text-indigo-500">
          Deen Companion &copy; 2025 | All rights reserved
        </footer>
      </div>
    </main>
  );
}
