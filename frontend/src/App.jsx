import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


// Page and component imports
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import Nav from "./components/Nav";
import TrackerLayout from "./components/TrackerLayout";
import HabitTracker from "./components/HabitTracker";
import PrayerTracker from "./components/PrayerTracker";
import DhikrTracker from "./components/DhikrTracker";
import QuranTracker from "./components/QuranTracker";
import Reminders from "./components/Reminders";
import ImaanChart from "./components/ImaanChart";
import WelcomeMessage from "./components/WelcomeMessage";
import Achievements from "./components/Achievements"; 
import WorshipLog from "./components/WorshipLog";     

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    function onStorageChange() {
      setToken(localStorage.getItem("token"));
    }
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  
  const requireAuth = (element) => (
    token ? element : <Navigate to="/login" replace />
  );

  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={token ? <Navigate to="/habits" /> : <Login setToken={setToken} />} />
        <Route path="/register" element={token ? <Navigate to="/habits" /> : <Register />} />
        <Route path="/dashboard" element={requireAuth(<DashboardPage />)} />
        <Route
          path="/habits"
          element={requireAuth(
            <TrackerLayout>
              <HabitTracker />
            </TrackerLayout>
          )}
        />
        <Route
          path="/prayers"
          element={requireAuth(
            <TrackerLayout>
              <PrayerTracker />
            </TrackerLayout>
          )}
        />
        <Route
          path="/dhikr"
          element={requireAuth(
            <TrackerLayout>
              <DhikrTracker />
            </TrackerLayout>
          )}
        />
        <Route
          path="/quran"
          element={requireAuth(
            <TrackerLayout>
              <QuranTracker />
            </TrackerLayout>
          )}
        />
        <Route
          path="/reminders"
          element={requireAuth(
            <TrackerLayout>
              <Reminders />
            </TrackerLayout>
          )}
        />
        <Route
          path="/charity"
          element={requireAuth(
            <TrackerLayout>
              <ImaanChart />
            </TrackerLayout>
          )}
        />
        <Route
          path="/welcome"
          element={requireAuth(
            <TrackerLayout>
              <WelcomeMessage />
            </TrackerLayout>
          )}
        />
        {/* Achievements route */}
        <Route
          path="/achievements"
          element={requireAuth(
            <TrackerLayout>
              <Achievements />
            </TrackerLayout>
          )}
        />
        {/* Worship Log route */}
        <Route
          path="/worship-log"
          element={requireAuth(
            <TrackerLayout>
              <WorshipLog />
            </TrackerLayout>
          )}
        />
        {/* Redirect any unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
