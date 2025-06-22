import React from 'react';

const ProductCard = ({ product, onAdd, onDelete, onEdit }) => (
  <div>
    <h3>{product.name} — ₹{product.price}</h3>
    <button onClick={() => onAdd(product)}>Add to Cart</button>
    {onEdit && <button onClick={() => onEdit(product)}>Edit</button>}
    {onDelete && <button onClick={() => onDelete(product._id)}>Delete</button>}
  </div>
);

export default ProductCard;
