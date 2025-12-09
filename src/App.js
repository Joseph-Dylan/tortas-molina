// En tu carpeta public, React ya creó los archivos
// Modifica src/App.js (en tu carpeta de React, no la de Express)

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar productos al iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <h2>Cargando productos...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error: {error}</h2>
        <button onClick={fetchProducts}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎮 Tienda Gamer</h1>
        <p>Productos disponibles: {products.length}</p>
      </header>

      <main>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.image_url || 'https://picsum.photos/300/200'} 
                  alt={product.name} 
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">
                  {product.description}
                </p>
                <div className="product-details">
                  <span className="product-price">${product.price}</span>
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="product-stock">
                  <span>Disponibles: {product.stock}</span>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => alert(`Agregaste ${product.name} al carrito`)}
                >
                  🛒 Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;