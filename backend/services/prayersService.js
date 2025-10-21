const axios = require('axios');

// Helper: Return today’s UNIX timestamp (seconds)
function getTodayUnixTime() {
  // Set time to midnight to get today's date
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor(now.getTime() / 1000);
}

// Helper: Get system timezone or fallback
function getSystemTimeZone() {
  try {
    // This works on Node.js 13+ and all browsers
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  } catch (e) {
    return "America/New_York"; // fallback
  }
}

exports.getTodaysPrayers = async (latitude, longitude) => {
  const unixTime = getTodayUnixTime();

  // Use valid IANA time zone (e.g., America/New_York).
  const timezonestring = getSystemTimeZone();

  try {
    const response = await axios.get('https://api.aladhan.com/v1/timings/' + unixTime, {
      params: {
        latitude,
        longitude,
        method: 2, // ISNA, adjust as needed
        timezonestring,
      },
    });

    // Safely extract only the 5 main prayers
    const timings = response.data?.data?.timings || {};
    const { Fajr, Dhuhr, Asr, Maghrib, Isha } = timings;
    return { Fajr, Dhuhr, Asr, Maghrib, Isha };
  } catch (error) {
    // Log error for debugging; don't throw to prevent 500 in worshipController
    console.error("getTodaysPrayers error:", error.message);
    return null; // let controller handle this gracefully
  }
};
