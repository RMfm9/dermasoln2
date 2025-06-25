import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const Home = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products', {
          withCredentials: true,
        });

        const data = res.data;

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("⚠️ Unexpected product data:", data);
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
    } else {
      addToCart(product);
    }
  };

  return (
    <div>
      <h2>Home - All Products</h2>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map(product => (
          <div key={product._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <h4>{product.name}</h4>
            <p>₹{product.price}</p>
            <Button label="Add to cart" icon="pi pi-plus" onClick={() => handleAddToCart(product)} />

          </div>
        ))
      )}
    </div>
  );
};

export default Home;
