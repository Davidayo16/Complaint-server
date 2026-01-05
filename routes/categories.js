const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Get all categories (public)
router.get('/', categoryController.getCategories);

// The following require admin
router.post('/', auth, role('admin'), categoryController.createCategory);
router.put('/:id', auth, role('admin'), categoryController.updateCategory);
router.delete('/:id', auth, role('admin'), categoryController.deleteCategory);

module.exports = router;
