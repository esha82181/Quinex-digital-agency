// =========================================================
// Admin routes — login is public, everything else is
// protected by the JWT auth middleware
// =========================================================
const express = require('express');
const router = express.Router();
const protectAdmin = require('../middleware/authMiddleware');
const {
  loginAdmin,
  getAllQuotes,
  getQuoteById,
  updateQuoteStatus,
  deleteQuote,
} = require('../controllers/adminController');
 
// POST /api/admin/login (public)
router.post('/login', loginAdmin);
 
// Everything below this line requires a valid JWT
router.use(protectAdmin);
 
// GET /api/admin/quotes
router.get('/quotes', getAllQuotes);
 
// GET /api/admin/quotes/:id
router.get('/quotes/:id', getQuoteById);
 
// PATCH /api/admin/quotes/:id
router.patch('/quotes/:id', updateQuoteStatus);
 
// DELETE /api/admin/quotes/:id
router.delete('/quotes/:id', deleteQuote);
 
module.exports = router;
 