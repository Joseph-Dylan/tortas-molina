import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configurar axios
axios.defaults.baseURL = 'http://localhost:5001';

function App() {
  const [backendStatus, setBackendStatus] = useState('Probando conexión...');
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [pagina, setPagina] = useState('inicio');
  const [carrito, setCarrito] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);

  // Estado para formularios
  const [formLogin, setFormLogin] = useState({ email: '', password: '' });
  const [formRegistro, setFormRegistro] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    verificarBackend();
    cargarProductos();
    verificarSesion();
  }, []);

  const verificarBackend = async () => {
    try {
      const response = await axios.get('/');
      setBackendStatus(`✅ ${response.data.message}`);
    } catch (error) {
      setBackendStatus(`❌ Error: ${error.message}`);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await axios.get('/api/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const verificarSesion = () => {
    const token = localStorage.getItem('token');
    const usuarioStorage = localStorage.getItem('usuario');
    
    if (token && usuarioStorage) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUsuario(JSON.parse(usuarioStorage));
      cargarCarrito();
    }
  };

  const cargarCarrito = async () => {
    try {
      const response = await axios.get('/api/carrito');
      setCarrito(response.data.items);
      setTotalCarrito(response.data.total);
    } catch (error) {
      console.error('Error cargando carrito:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formLogin);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUsuario(response.data.usuario);
      
      alert('✅ Login exitoso');
      setPagina('inicio');
      cargarCarrito();
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/registrar', formRegistro);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUsuario(response.data.usuario);
      
      alert('✅ Registro exitoso');
      setPagina('inicio');
      cargarCarrito();
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    delete axios.defaults.headers.common['Authorization'];
    setUsuario(null);
    setCarrito([]);
    setTotalCarrito(0);
    alert('Sesión cerrada');
    setPagina('inicio');
  };

  const agregarAlCarrito = async (productoId) => {
    if (!usuario) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      setPagina('login');
      return;
    }

    try {
      await axios.post('/api/carrito/agregar', { productoId });
      await cargarCarrito();
      alert('✅ Producto agregado al carrito');
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const comprarCarrito = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!confirm(`¿Confirmar compra por $${totalCarrito}?`)) return;

    try {
      await axios.post('/api/ventas/comprar', { metodo_pago: 'efectivo' });
      setCarrito([]);
      setTotalCarrito(0);
      alert('✅ Compra realizada exitosamente');
      setPagina('inicio');
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const renderNavbar = () => (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => setPagina('inicio')}>
        🎂 Tortas Molina
      </div>
      <div style={styles.navLinks}>
        <button style={styles.navButton} onClick={() => setPagina('inicio')}>
          Inicio
        </button>
        <button style={styles.navButton} onClick={() => setPagina('productos')}>
          Tortas
        </button>
        {usuario && (
          <>
            <button style={styles.navButton} onClick={() => setPagina('carrito')}>
              🛒 Carrito ({carrito.length})
            </button>
            <button style={styles.navButton} onClick={() => setPagina('perfil')}>
              👤 Perfil
            </button>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        )}
        {!usuario && (
          <>
            <button style={styles.navButton} onClick={() => setPagina('login')}>
              Iniciar Sesión
            </button>
            <button style={styles.registerButton} onClick={() => setPagina('registro')}>
              Registrarse
            </button>
          </>
        )}
      </div>
    </nav>
  );

  const renderInicio = () => (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🎂 Bienvenido a Tortas Molina</h1>
        <p style={styles.heroSubtitle}>Las mejores tortas artesanales de la ciudad</p>
        <div style={styles.statusBox}>
          <p>{backendStatus}</p>
        </div>
      </div>

      <div style={styles.features}>
        <h2>✨ Nuestros Servicios</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <h3>🎂 Tortas Clásicas</h3>
            <p>Recetas tradicionales con el sabor de siempre</p>
          </div>
          <div style={styles.featureCard}>
            <h3>🎉 Tortas Especiales</h3>
            <p>Para cumpleaños, bodas y eventos especiales</p>
          </div>
          <div style={styles.featureCard}>
            <h3>🎨 Personalizadas</h3>
            <p>Diseños únicos según tus preferencias</p>
          </div>
        </div>
      </div>

      <div style={styles.quickActions}>
        <h2>🚀 Comienza ahora</h2>
        <div style={styles.actionButtons}>
          <button 
            style={styles.primaryButton}
            onClick={() => setPagina('productos')}
          >
            Ver Tortas Disponibles
          </button>
          {!usuario && (
            <button 
              style={styles.secondaryButton}
              onClick={() => setPagina('registro')}
            >
              Crear Cuenta
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderProductos = () => (
    <div style={styles.container}>
      <h1 style={styles.title}>🎂 Nuestras Tortas</h1>
      <p style={styles.subtitle}>{productos.length} productos disponibles</p>
      
      <div style={styles.productGrid}>
        {productos.map(producto => (
          <div key={producto.id} style={styles.productCard}>
            <div style={{
              ...styles.productImage,
              backgroundImage: `url(${producto.imagen_url || 'https://via.placeholder.com/300x200?text=Torta'})`
            }}></div>
            <div style={styles.productInfo}>
              <h3 style={styles.productName}>{producto.nombre}</h3>
              <p style={styles.productDesc}>{producto.descripcion}</p>
              <div style={styles.productDetails}>
                <span style={styles.productPrice}>${producto.precio}</span>
                <span style={styles.productStock}>
                  {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                </span>
              </div>
              <button
                style={{
                  ...styles.addToCartButton,
                  opacity: producto.stock === 0 || !usuario ? 0.5 : 1
                }}
                onClick={() => agregarAlCarrito(producto.id)}
                disabled={producto.stock === 0 || !usuario}
              >
                {!usuario ? 'Inicia sesión' : producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCarrito = () => (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 Tu Carrito</h1>
      
      {carrito.length === 0 ? (
        <div style={styles.emptyCart}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Tu carrito está vacío</p>
          <button 
            style={styles.primaryButton}
            onClick={() => setPagina('productos')}
          >
            Ver Tortas
          </button>
        </div>
      ) : (
        <>
          <div style={styles.cartItems}>
            {carrito.map(item => (
              <div key={item.producto_id} style={styles.cartItem}>
                <div style={styles.cartItemImage}></div>
                <div style={styles.cartItemInfo}>
                  <h3>{item.nombre}</h3>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Precio unitario: ${item.precio}</p>
                  <p>Subtotal: ${(item.precio * item.cantidad).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div style={styles.cartSummary}>
            <h2>Resumen de Compra</h2>
            <div style={styles.summaryRow}>
              <span>Total:</span>
              <span style={styles.totalAmount}>${totalCarrito}</span>
            </div>
            <button 
              style={styles.buyButton}
              onClick={comprarCarrito}
            >
              💳 Realizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderLogin = () => (
    <div style={styles.authContainer}>
      <h1 style={styles.title}>🔐 Iniciar Sesión</h1>
      
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={formLogin.email}
          onChange={(e) => setFormLogin({...formLogin, email: e.target.value})}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={formLogin.password}
          onChange={(e) => setFormLogin({...formLogin, password: e.target.value})}
          style={styles.input}
          required
        />
        
        <button type="submit" style={styles.primaryButton}>
          Iniciar Sesión
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          ¿No tienes cuenta?{' '}
          <button 
            type="button"
            onClick={() => setPagina('registro')}
            style={styles.linkButton}
          >
            Regístrate aquí
          </button>
        </p>
      </form>
      
      <div style={styles.demoCredentials}>
        <p>🔑 Credenciales de prueba:</p>
        <p><strong>Email:</strong> cliente@tortas.com</p>
        <p><strong>Contraseña:</strong> 123456</p>
      </div>
    </div>
  );

  const renderRegistro = () => (
    <div style={styles.authContainer}>
      <h1 style={styles.title}>📝 Registrarse</h1>
      
      <form onSubmit={handleRegistro} style={styles.form}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={formRegistro.nombre}
          onChange={(e) => setFormRegistro({...formRegistro, nombre: e.target.value})}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formRegistro.email}
          onChange={(e) => setFormRegistro({...formRegistro, email: e.target.value})}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={formRegistro.password}
          onChange={(e) => setFormRegistro({...formRegistro, password: e.target.value})}
          style={styles.input}
          required
          minLength="6"
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={formRegistro.telefono}
          onChange={(e) => setFormRegistro({...formRegistro, telefono: e.target.value})}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={formRegistro.direccion}
          onChange={(e) => setFormRegistro({...formRegistro, direccion: e.target.value})}
          style={styles.input}
        />
        
        <button type="submit" style={styles.primaryButton}>
          Crear Cuenta
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          ¿Ya tienes cuenta?{' '}
          <button 
            type="button"
            onClick={() => setPagina('login')}
            style={styles.linkButton}
          >
            Inicia sesión aquí
          </button>
        </p>
      </form>
    </div>
  );

  const renderPerfil = () => (
    <div style={styles.container}>
      <h1 style={styles.title}>👤 Tu Perfil</h1>
      
      {usuario && (
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.profileAvatar}>
              {usuario.nombre.charAt(0)}
            </div>
            <h2>{usuario.nombre}</h2>
            <p style={styles.profileEmail}>{usuario.email}</p>
          </div>
          
          <div style={styles.profileInfo}>
            <div style={styles.infoRow}>
              <strong>Teléfono:</strong>
              <span>{usuario.telefono || 'No registrado'}</span>
            </div>
            <div style={styles.infoRow}>
              <strong>Dirección:</strong>
              <span>{usuario.direccion || 'No registrada'}</span>
            </div>
            <div style={styles.infoRow}>
              <strong>Rol:</strong>
              <span>{usuario.rol}</span>
            </div>
          </div>
          
          <div style={styles.profileActions}>
            <button 
              style={styles.secondaryButton}
              onClick={() => {
                // Aquí podrías implementar la edición del perfil
                alert('Función de edición de perfil en desarrollo');
              }}
            >
              Editar Perfil
            </button>
            <button 
              style={styles.secondaryButton}
              onClick={() => {
                // Aquí podrías implementar ver historial de compras
                alert('Historial de compras en desarrollo');
              }}
            >
              Ver Mis Compras
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.app}>
      {renderNavbar()}
      
      <main style={styles.main}>
        {pagina === 'inicio' && renderInicio()}
        {pagina === 'productos' && renderProductos()}
        {pagina === 'carrito' && renderCarrito()}
        {pagina === 'login' && renderLogin()}
        {pagina === 'registro' && renderRegistro()}
        {pagina === 'perfil' && renderPerfil()}
      </main>
      
      <footer style={styles.footer}>
        <p>🎂 Tortas Molina - Sistema de Ventas © 2024</p>
        <p>Sistema desarrollado para la gestión de ventas de tortas artesanales</p>
      </footer>
    </div>
  );
}

// Estilos CSS-in-JS
const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  navLinks: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  navButton: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  logoutButton: {
    background: '#ff4757',
    border: 'none',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  registerButton: {
    background: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  main: {
    flex: 1,
    padding: '20px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  hero: {
    textAlign: 'center',
    padding: '50px 20px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: '10px',
    marginBottom: '40px',
  },
  heroTitle: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#333',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '20px',
  },
  statusBox: {
    background: 'white',
    padding: '15px',
    borderRadius: '8px',
    display: 'inline-block',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  features: {
    marginBottom: '40px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  featureCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  quickActions: {
    textAlign: 'center',
    padding: '30px',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '30px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
  },
  productCard: {
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s',
  },
  productImage: {
    height: '200px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  productInfo: {
    padding: '20px',
  },
  productName: {
    fontSize: '1.3rem',
    marginBottom: '10px',
    color: '#333',
  },
  productDesc: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '15px',
    minHeight: '40px',
  },
  productDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  productPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  productStock: {
    background: '#f8f9fa',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '0.9rem',
    color: '#666',
  },
  addToCartButton: {
    width: '100%',
    padding: '12px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  authContainer: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 3px 15px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  primaryButton: {
    padding: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: '10px 20px',
    background: '#f8f9fa',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  demoCredentials: {
    marginTop: '30px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '5px',
    fontSize: '0.9rem',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '50px 20px',
  },
  cartItems: {
    marginBottom: '30px',
  },
  cartItem: {
    display: 'flex',
    background: 'white',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  cartItemImage: {
    width: '80px',
    height: '80px',
    background: '#f0f0f0',
    borderRadius: '5px',
    marginRight: '15px',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartSummary: {
    background: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    fontSize: '1.2rem',
  },
  totalAmount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  buyButton: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  profileCard: {
    background: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 3px 15px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '0 auto',
  },
  profileHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  profileAvatar: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: 'white',
    margin: '0 auto 15px',
  },
  profileEmail: {
    color: '#666',
  },
  profileInfo: {
    marginBottom: '30px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  profileActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  footer: {
    background: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: '40px',
  },
};

export default App;