const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// All routes require authentication
router.use(auth);

// Create complaint
router.post('/', complaintController.createComplaint);
// Get all complaints (admin or user)
router.get('/', complaintController.getComplaints);
// Get single complaint
router.get('/:id', complaintController.getComplaintById);
// Update complaint (admin or owner)
router.put('/:id', complaintController.updateComplaint);
// Delete complaint (admin or owner)
router.delete('/:id', complaintController.deleteComplaint);
// Assign complaint (admin only)
router.patch('/:id/assign', role('admin'), complaintController.assignComplaint);

module.exports = router;
