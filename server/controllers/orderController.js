const Order = require('../models/Order');
const Product = require('../models/Product');
// const { sendLowStockEmail } = require('../utils/mailer'); // Optional email alerts

// 📦 Place an order
exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    // ✅ Check user authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized. Please login again." });
    }

    // ✅ Validate order items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "No items in order" });
    }

    const formattedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ msg: `Product not found: ${item.productId}` });

      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${product.name}. Available: ${product.stock}` });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      if (product.stock <= 2) {
        console.warn(`⚠️ Low stock for ${product.name}: ${product.stock}`);
        // await sendLowStockEmail(product.name, product.stock);
      }

      formattedItems.push({
        product: product._id,
        quantity: item.quantity
      });
    }

    const newOrder = new Order({
      user: req.user._id,
      items: formattedItems,
      totalAmount,
      shippingAddress,
    });

    await newOrder.save();

    console.log("✅ Order placed:", newOrder._id);
    res.status(201).json({ msg: 'Order placed successfully', order: newOrder });

  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ msg: "Server error while placing order", error: err.message });
  }
};

// 👤 Get orders for logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name price image');

    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to get user's orders:", err);
    res.status(500).json({ msg: 'Failed to fetch your orders', error: err.message });
  }
};

// 🛒 Get all recent orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const orders = await Order.find({
      createdAt: { $gte: last30Days }
    })
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch all orders:", err);
    res.status(500).json({ msg: 'Failed to fetch orders', error: err.message });
  }
};

// 🛑 User requests to cancel their order
exports.requestOrderCancel = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to cancel this order" });
    }

    order.cancelRequest = true;
    await order.save();

    res.json({ msg: "Cancellation request sent" });
  } catch (err) {
    console.error("❌ Cancel request error:", err);
    res.status(500).json({ msg: "Failed to request cancellation", error: err.message });
  }
};

// ✅ Admin approves cancellation
exports.approveCancel = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || !order.cancelRequest) {
      return res.status(404).json({ msg: "No cancellation request found" });
    }

    order.cancelApproved = true;
    order.status = "Cancelled";
    await order.save();

    res.json({ msg: "Order cancelled successfully by admin" });
  } catch (err) {
    console.error("❌ Cancel approval error:", err);
    res.status(500).json({ msg: "Failed to approve cancellation", error: err.message });
  }
};
