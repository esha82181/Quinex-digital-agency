// =========================================================
// Public routes — used by the Contact / Get a Free Quote form
// =========================================================
const express = require('express');
const router = express.Router();
const { createQuoteRequest } = require('../controllers/quoteController');
 
// POST /api/quotes
router.post('/', createQuoteRequest);
 
module.exports = router;