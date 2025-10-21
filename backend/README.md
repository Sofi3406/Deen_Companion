/backend
|-- server.js               # Entry point, Express app setup
|-- config/
|     |-- db.js             # MongoDB connection
|-- models/
|     |-- User.js           # User schema
|     |-- Activity.js       # Activity tracking schema
|-- routes/
|     |-- auth.js           # Auth routes (signup, login)
|     |-- prayers.js        # Prayer related endpoints
|     |-- quran.js          # Quran verse related endpoints
|     |-- activities.js     # Track user activities
|     |-- leaderboard.js    # Leaderboard endpoint
|-- middleware/
|     |-- authMiddleware.js # JWT verification
|-- controllers/
|     |-- authController.js
|     |-- prayersController.js
|     |-- quranController.js
|     |-- activitiesController.js
|-- utils/
|     |-- gamification.js   # Points and badges calculation
|-- .env                    # Environment variables
|-- package.json            # Dependencies and scripts
