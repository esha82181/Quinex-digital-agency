// =========================================================
// Handles admin login + CRUD on quote requests
// Admin credentials live in .env — no separate MongoDB
// "Admin" collection needed for a single admin user
// =========================================================
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const QuoteRequest = require('../models/QuoteRequest');
 
// POST /api/admin/login  (public — this IS the login endpoint)
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
 
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }
 
    const isUsernameCorrect = username === process.env.ADMIN_USERNAME;
 
    // ADMIN_PASSWORD_HASH in .env is a bcrypt hash — see the setup guide
    // for how to generate it. We never store the plain password.
    const isPasswordCorrect = isUsernameCorrect
      ? await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
      : false;
 
    if (!isUsernameCorrect || !isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
 
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2d' });
 
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Admin login error:', error.message);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};
 
// GET /api/admin/quotes  (protected)
exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: quotes });
  } catch (error) {
    console.error('Error fetching quotes:', error.message);
    return res.status(500).json({ success: false, message: 'Could not load requests.' });
  }
};
 
// GET /api/admin/quotes/:id  (protected)
exports.getQuoteById = async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }
    return res.status(200).json({ success: true, data: quote });
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    return res.status(500).json({ success: false, message: 'Could not load this request.' });
  }
};
 
// PATCH /api/admin/quotes/:id  (protected) — update status
exports.updateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['New', 'Contacted', 'In Progress', 'Completed'];
 
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
 
    const updated = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
 
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }
 
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating quote:', error.message);
    return res.status(500).json({ success: false, message: 'Could not update this request.' });
  }
};
 
// DELETE /api/admin/quotes/:id  (protected)
exports.deleteQuote = async (req, res) => {
  try {
    const deleted = await QuoteRequest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }
    return res.status(200).json({ success: true, message: 'Request deleted.' });
  } catch (error) {
    console.error('Error deleting quote:', error.message);
    return res.status(500).json({ success: false, message: 'Could not delete this request.' });
  }
};