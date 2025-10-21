// /backend/scripts/reminderCronJob.js
const cron = require('node-cron');
const Reminder = require('../models/Reminder');
// Setup Firebase Cloud Messaging (FCM) or another service for push notifications

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"
  
  try {
    // Find reminders matching current time and enabled
    const reminders = await Reminder.find({ time: currentTime, enabled: true });
    
    reminders.forEach(reminder => {
      // Send push notification logic here using FCM or Web Push
      // For example:
      // sendPushNotification(reminder.user, reminder.message || "It's time for your reminder!");
    });
  } catch (error) {
    console.error('Error running reminder cron job:', error);
  }
});
