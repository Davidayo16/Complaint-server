const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  // PHCN / Nigeria electricity–specific fields
  disco: {
    // e.g. IKEDC, EKEDC, AEDC, PHED, KEDCO, etc.
    type: String,
    trim: true,
    maxlength: 50,
  },
  meterNumber: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  accountNumber: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  phoneNumber: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  address: {
    type: String,
    trim: true,
    maxlength: 255,
  },
  state: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  lga: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  feederOrTransformer: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolutionNotes: {
    type: String,
    maxlength: 2000
  },
  attachments: [{
    type: String // File URLs or paths
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
