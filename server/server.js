// =========================================================
// QUINEX BACKEND — Express server entry point
// Run with: npm run dev  (from inside the /server folder)
// =========================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const quoteRoutes = require('./routes/quoteRoutes');
const adminRoutes = require('./routes/adminRoutes');
 
const app = express();
 
// ---- Middleware ----
app.use(cors()); // allows the static frontend (opened via file:// or another port) to call this API
app.use(express.json()); // parses incoming JSON request bodies
 
// ---- Connect to MongoDB ----
connectDB();
 
// ---- Routes ----
app.use('/api/quotes', quoteRoutes);
app.use('/api/admin', adminRoutes);
 
// Simple health check route
app.get('/', (req, res) => {
  res.send('Quinex backend is running.');
});
 
// ---- Start server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
 