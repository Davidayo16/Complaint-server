const User = require('../models/User');
const Complaint = require('../models/Complaint');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get complaint statistics
exports.getComplaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const inProgress = await Complaint.countDocuments({ status: 'in_progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    const rejected = await Complaint.countDocuments({ status: 'rejected' });
    res.json({ total, pending, inProgress, resolved, rejected });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
