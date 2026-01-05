const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// All admin routes require admin role
router.use(auth, role('admin'));

// Get all users
router.get('/users', adminController.getUsers);
// Delete a user
router.delete('/users/:id', adminController.deleteUser);
// Get complaint stats
router.get('/complaint-stats', adminController.getComplaintStats);

module.exports = router;
