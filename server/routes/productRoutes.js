const express = require('express');
const { getProducts, addProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/list', getProducts);
router.post('/add', protect, admin, addProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.put('/:id', protect, admin, updateProduct);

module.exports = router;
