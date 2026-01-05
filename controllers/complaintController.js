const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Category = require('../models/Category');

// Create a new complaint
exports.createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      attachments,
      // PHCN-specific optional fields
      disco,
      meterNumber,
      accountNumber,
      phoneNumber,
      address,
      state,
      lga,
      feederOrTransformer,
    } = req.body;

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Validate attachments (if provided)
    if (
      attachments &&
      (!Array.isArray(attachments) ||
        attachments.some((url) => typeof url !== "string"))
    ) {
      return res
        .status(400)
        .json({ message: "Attachments must be an array of valid URLs" });
    }

    const complaint = new Complaint({
      user: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category,
      attachments: attachments || [],
      // PHCN-specific context (all optional)
      disco: disco?.trim(),
      meterNumber: meterNumber?.trim(),
      accountNumber: accountNumber?.trim(),
      phoneNumber: phoneNumber?.trim(),
      address: address?.trim(),
      state: state?.trim(),
      lga: lga?.trim(),
      feederOrTransformer: feederOrTransformer?.trim(),
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    // Handle specific Mongoose validation errors
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }
    // Handle invalid ObjectId errors
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    console.error("Create complaint error:", err); // Log for debugging
    res.status(500).json({ message: "Server error" });
  }
};
// Get all complaints (admin) or user's complaints
exports.getComplaints = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const complaints = await Complaint.find(filter)
      .populate('user', 'name email')
      .populate('category', 'name');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a single complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email')
      .populate('category', 'name');
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    // Only admin or owner can view
    if (req.user.role !== 'admin' && !complaint.user._id.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update complaint status or details (admin or owner)
exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    // Only admin or owner can update
    if (req.user.role !== 'admin' && !complaint.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const updates = req.body;
    Object.assign(complaint, updates);
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Assign complaint to a staff/admin (admin only)
exports.assignComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    const { assignedTo } = req.body;
    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }
    complaint.assignedTo = assignedTo;
    complaint.status = 'in_progress';
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a complaint (admin or owner)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (req.user.role !== 'admin' && !complaint.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await complaint.remove();
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
