// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');

// Initilize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import routes
const diaryRoutes = require('./routes/diaryRoutes');
app.use('/entries', diaryRoutes);

// Optional root route
app.get('/', (req, res) => {
    res.send("Hello from Express!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});