// =========================================================
// Mongoose schema for the "quoteRequests" collection
// Every Contact / Get a Free Quote submission is stored
// as one document of this shape
// =========================================================
const mongoose = require('mongoose');
 
const quoteRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    service: {
      type: String,
      required: [true, 'Please select a service'],
      enum: [
        'Video Editing',
        'Graphic Design & Branding',
        'Website Development',
        'Social Media Management',
        'Content Writing',
        'Digital Marketing',
        'Brand Identity',
        'Social Media Designs',
        'Video Editing Projects',
        'Website Projects',
        'Business Cards & Stationery',
        'Other',
      ],
    },
    budget: {
      type: String,
      trim: true,
      default: '',
    },
    projectDetails: {
      type: String,
      required: [true, 'Please describe your project'],
      trim: true,
    },
    preferredContact: {
      type: String,
      enum: ['Email', 'Phone', 'WhatsApp', ''],
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Progress', 'Completed'],
      default: 'New',
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);
 
module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);