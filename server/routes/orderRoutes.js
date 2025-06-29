const express = require('express');
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus,
  requestOrderCancel, 
  approveCancel  } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Order routes
router.post('/place', protect, placeOrder);                 // POST /api/orders/place
router.get('/my', protect, getMyOrders);                    // GET /api/orders/my
router.get('/all', protect, admin, getAllOrders);           // GET /api/orders/all
router.put("/:id/cancel-request", protect, requestOrderCancel);
router.put("/:id/cancel-approve", protect, admin, approveCancel);


module.exports = router;
