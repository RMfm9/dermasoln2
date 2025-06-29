const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch products', error: err.message });
  }
};

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    if (!name || !price || !description || !image) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const product = new Product({ name, price, description, image });
    await product.save();

    res.status(201).json({ msg: 'Product added', product });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to add product', error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete product', error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, image },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ msg: 'Product not found' });

    res.json({ msg: 'Product updated', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update product', error: err.message });
  }
};
