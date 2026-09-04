// =========================================================
// Handles logic for the PUBLIC contact form endpoint
// =========================================================
const QuoteRequest = require('../models/QuoteRequest');
 
// POST /api/quotes  (public — anyone can submit)
exports.createQuoteRequest = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      companyName,
      service,
      budget,
      projectDetails,
      preferredContact,
    } = req.body;
 
    // ---- Backend validation (never trust the frontend alone) ----
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
 
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!email || !emailPattern.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
 
    if (!service) {
      return res.status(400).json({ success: false, message: 'Please select a service.' });
    }
 
    if (!projectDetails || !projectDetails.trim()) {
      return res.status(400).json({ success: false, message: 'Please describe your project.' });
    }
 
    // ---- Save to MongoDB ----
    const newRequest = await QuoteRequest.create({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      companyName: companyName ? companyName.trim() : '',
      service,
      budget: budget ? budget.trim() : '',
      projectDetails: projectDetails.trim(),
      preferredContact: preferredContact || '',
    });
 
    return res.status(201).json({
      success: true,
      message: 'Your request has been submitted successfully.',
      data: { id: newRequest._id },
    });
  } catch (error) {
    console.error('Error creating quote request:', error.message);
    // Never leak internal/technical error details to the client
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};