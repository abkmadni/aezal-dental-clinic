require('dotenv').config({path:__dirname+'/./../../.env'})
const express = require('express');
const connectDB = require('./config/dbConfig.js');
const userRoutes = require('./routes/userRoutes.js');
const appointmentRoutes = require('./routes/appointmentRoutes.js');
const treatmentRoutes = require('./routes/treatmentRoutes.js');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


// Load environment variables
console.log('MONGO_URI:', process.env.MONGO_URI);


// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev')); // Logs requests to the console
app.use(cookieParser());

// API Routes
app.use('/api/auth', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);

// Root route (basic health check)
app.get('/', (req, res) => {
    res.send('🦷 Aezal Dental Clinic API is running...');
});

// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error('Global Error:', err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
