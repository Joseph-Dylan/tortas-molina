import React, { useState, useEffect } from "react";
import axios from "axios";

// Configurar axios
axios.defaults.baseURL = "http://localhost:5001";

function App() {
  const [backendStatus, setBackendStatus] = useState("Probando conexión...");
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [pagina, setPagina] = useState("inicio");
  const [carrito, setCarrito] = useState([]);
  const [totalCarrito, setTotalCarrito] = useState(0);

  // Estado para formularios
  const [formLogin, setFormLogin] = useState({ email: "", password: "" });
  const [formRegistro, setFormRegistro] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    verificarBackend();
    cargarProductos();
    verificarSesion();
  }, []);

  const verificarBackend = async () => {
    try {
      const response = await axios.get("/");
      setBackendStatus(`✅ ${response.data.message}`);
    } catch (error) {
      setBackendStatus(`❌ Error: ${error.message}`);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await axios.get("/api/productos");
      const productosConImagenes = response.data.map((producto) => ({
        ...producto,
        imagen_url: producto.imagen_url || "/imagenes-tortas/torta-default.jpg",
      }));
      setProductos(response.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const verificarSesion = () => {
    const token = localStorage.getItem("token");
    const usuarioStorage = localStorage.getItem("usuario");

    if (token && usuarioStorage) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUsuario(JSON.parse(usuarioStorage));
      cargarCarrito();
    }
  };

  const cargarCarrito = async () => {
    try {
      const response = await axios.get("/api/carrito");
      setCarrito(response.data.items);
      setTotalCarrito(response.data.total);
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", formLogin);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      setUsuario(response.data.usuario);

      alert("✅ Login exitoso");
      setPagina("inicio");
      cargarCarrito();
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/registrar", formRegistro);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      setUsuario(response.data.usuario);

      alert("✅ Registro exitoso");
      setPagina("inicio");
      cargarCarrito();
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    delete axios.defaults.headers.common["Authorization"];
    setUsuario(null);
    setCarrito([]);
    setTotalCarrito(0);
    alert("Sesión cerrada");
    setPagina("inicio");
  };

  const agregarAlCarrito = async (productoId) => {
    if (!usuario) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      setPagina("login");
      return;
    }

    try {
      await axios.post("/api/carrito/agregar", { productoId });
      await cargarCarrito();
      alert("✅ Producto agregado al carrito");
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const comprarCarrito = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (!confirm(`¿Confirmar compra por $${totalCarrito}?`)) return;

    try {
      await axios.post("/api/ventas/comprar", { metodo_pago: "efectivo" });
      setCarrito([]);
      setTotalCarrito(0);
      alert("✅ Compra realizada exitosamente");
      setPagina("inicio");
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const renderNavbar = () => (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => setPagina("inicio")}>
        <img
          src="/tortas-molina.png"
          alt="Tortas Molina"
          style={styles.logoImage}
        />
        Tortas Molina
      </div>
      <div style={styles.navLinks}>
        <button style={styles.navButton} onClick={() => setPagina("inicio")}>
          Inicio
        </button>
        <button style={styles.navButton} onClick={() => setPagina("productos")}>
          Tortas
        </button>
        {usuario && (
          <>
            <button
              style={styles.navButton}
              onClick={() => setPagina("carrito")}
            >
              🛒 Carrito ({carrito.length})
            </button>
            <button
              style={styles.navButton}
              onClick={() => setPagina("perfil")}
            >
              👤 Perfil
            </button>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        )}
        {!usuario && (
          <>
            <button style={styles.navButton} onClick={() => setPagina("login")}>
              Iniciar Sesión
            </button>
            <button
              style={styles.registerButton}
              onClick={() => setPagina("registro")}
            >
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
        <h1 style={styles.heroTitle}>🥪 Bienvenido a Tortas Molina</h1>
        <p style={styles.heroSubtitle}>
          Las mejores tortas artesanales de la ciudad
        </p>
        <div style={styles.statusBox}>
          <p>{backendStatus}</p>
        </div>
      </div>

      <div style={styles.features}>
        <h2>✨ Nuestros Servicios</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <h3>🥪 Tortas Clásicas</h3>
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
        <h2>Comienza ahora</h2>
        <div style={styles.actionButtons}>
          <button
            style={styles.primaryButton}
            onClick={() => setPagina("productos")}
          >
            Ver Tortas Disponibles
          </button>
          {!usuario && (
            <button
              style={styles.secondaryButton}
              onClick={() => setPagina("registro")}
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
      <h1 style={styles.title}>🥪 Nuestras Tortas</h1>
      <p style={styles.subtitle}>{productos.length} productos disponibles</p>

      <div style={styles.productGrid}>
        {productos.map((producto) => {
          const imagenURL =
            producto.imagen_url || "/imagenes-tortas/torta-default.jpg";

          return (
            <div key={producto.id} style={styles.productCard}>
              <div style={styles.productImageContainer}>
                <img
                  src={imagenURL}
                  alt={producto.nombre}
                  style={styles.productImageTag}
                  onError={(e) => {
                    e.target.src = "/imagenes-tortas/torta-default.jpg";
                  }}
                />
              </div>
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{producto.nombre}</h3>
                <p style={styles.productDesc}>{producto.descripcion}</p>
                <div style={styles.productDetails}>
                  <span style={styles.productPrice}>${producto.precio}</span>
                  <span style={styles.productStock}>
                    {producto.stock > 0
                      ? `Stock: ${producto.stock}`
                      : "Agotado"}
                  </span>
                </div>
                <button
                  style={{
                    ...styles.addToCartButton,
                    opacity: producto.stock === 0 || !usuario ? 0.5 : 1,
                  }}
                  onClick={() => agregarAlCarrito(producto.id)}
                  disabled={producto.stock === 0 || !usuario}
                >
                  {!usuario
                    ? "Inicia sesión"
                    : producto.stock === 0
                    ? "Agotado"
                    : "Agregar al Carrito"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCarrito = () => (
    <>
      <div style={styles.container}>
        <h1 style={styles.title}>🛒 Tu Carrito</h1>

        {carrito.length === 0 ? (
          <div style={styles.emptyCart}>
            <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
              Tu carrito está vacío
            </p>
            <button
              style={styles.primaryButton}
              onClick={() => setPagina("productos")}
            >
              Ver Tortas
            </button>
          </div>
        ) : (
          <>
            <div style={styles.cartItems}>
              {carrito.map((item) => {
                // Buscar el producto completo en el estado productos para obtener la imagen
                const producto = productos.find(
                  (p) => p.id === item.producto_id
                );
                const imagenURL =
                  producto?.imagen_url || "/imagenes-tortas/torta-default.jpg";

                return (
                  <div key={item.producto_id} style={styles.cartItem}>
                    <div
                      style={{
                        ...styles.cartItemImage,
                        backgroundImage: `url(${imagenURL})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                    <div style={styles.cartItemInfo}>
                      <h3>{item.nombre}</h3>
                      <p>Cantidad: {item.cantidad}</p>
                      <p>Precio unitario: ${item.precio}</p>
                      <p>
                        Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={styles.cartSummary}>
              <h2>Resumen de Compra</h2>
              <div style={styles.summaryRow}>
                <span>Total:</span>
                <span style={styles.totalAmount}>${totalCarrito}</span>
              </div>
              <button style={styles.buyButton} onClick={comprarCarrito}>
                💳 Realizar Compra
              </button>
            </div>
          </>
        )}
      </div>

      {/* Estilos CSS para el carrito */}
      <style>
        {`
        /* Animación para items del carrito */
        [style*="cartItem"] {
          animation: fadeIn 0.5s ease-out;
        }

        /* Hover effect para items del carrito */
        [style*="cartItem"]:hover {
          transform: translateX(5px);
          box-shadow: 0 5px 20px rgba(198, 40, 40, 0.2);
          border-color: #F9A825;
        }

        /* Estilos para la imagen del carrito */
        [style*="cartItemImage"] {
          min-width: 120px;
          min-height: 120px;
          border-radius: 10px;
          border: 3px solid #F5E2C8;
          overflow: hidden;
          background-color: #F5E2C8;
        }

        /* Estilos para los textos del carrito */
        [style*="cartItemInfo"] h3 {
          font-size: 1.3rem;
          color: #C62828;
          font-weight: bold;
          margin: 0 0 10px 0;
        }

        [style*="cartItemInfo"] p {
          margin: 5px 0;
          color: #757575;
          font-size: 0.95rem;
        }

        [style*="cartItemInfo"] p:last-child {
          font-weight: bold;
          color: #2E7D32;
          font-size: 1.1rem;
          margin-top: 10px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          [style*="cartItem"] {
            flex-direction: column;
            text-align: center;
          }

          [style*="cartItemImage"] {
            width: 180px;
            height: 120px;
            margin: 0 auto 15px;
          }

          [style*="cartItemInfo"] h3 {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          [style*="cartItemImage"] {
            width: 150px;
            height: 100px;
          }
        }
      `}
      </style>
    </>
  );

  const renderLogin = () => (
    <>
      <div style={styles.authContainer}>
        <h1 style={styles.title}>🔐 Iniciar Sesión</h1>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={formLogin.email}
            onChange={(e) =>
              setFormLogin({ ...formLogin, email: e.target.value })
            }
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={formLogin.password}
            onChange={(e) =>
              setFormLogin({ ...formLogin, password: e.target.value })
            }
            style={styles.input}
            required
          />

          <button type="submit" style={styles.primaryButton}>
            Iniciar Sesión
          </button>

          <p style={{ textAlign: "center", marginTop: "15px" }}>
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => setPagina("registro")}
              style={styles.linkButton}
            >
              Regístrate aquí
            </button>
          </p>
        </form>

        <div style={styles.demoCredentials}>
          <p>🔑 Credenciales de prueba:</p>
          <p>
            <strong>Email:</strong> cliente@tortas.com
          </p>
          <p>
            <strong>Contraseña:</strong> 123456
          </p>
        </div>
      </div>

      <style>
        {`
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    /* Decoración del contenedor */
    [style*="authContainer"] {
      position: relative;
      overflow: hidden;
    }

    [style*="authContainer"]::before {
      content: '🌮';
      position: absolute;
      top: -20px;
      right: -20px;
      font-size: 4rem;
      opacity: 0.15;
      transform: rotate(15deg);
      z-index: 1;
    }

    [style*="authContainer"]::after {
      content: '🌶️';
      position: absolute;
      bottom: -20px;
      left: -20px;
      font-size: 4rem;
      opacity: 0.15;
      transform: rotate(-15deg);
      z-index: 1;
    }

    /* Focus en inputs */
    [style*="input"]:focus {
      outline: none;
      border-color: #F9A825;
      box-shadow: 0 0 0 3px rgba(249, 168, 37, 0.2);
      transform: translateY(-2px);
    }

    [style*="input"]:hover {
      border-color: #F9A825;
    }

    /* Hover en botón primario */
    [style*="primaryButton"] {
      position: relative;
      overflow: hidden;
    }

    [style*="primaryButton"]:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 25px rgba(198, 40, 40, 0.5);
      background: linear-gradient(135deg, #F9A825 0%, #C62828 100%);
    }

    [style*="primaryButton"]:active {
      transform: translateY(-1px);
    }

    /* Efecto de brillo en botón */
    [style*="primaryButton"]::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.6s;
      z-index: 1;
    }

    [style*="primaryButton"]:hover::before {
      left: 100%;
    }

    /* Hover en link button */
    [style*="linkButton"]:hover {
      color: #F9A825;
      text-decoration-color: #F9A825;
    }

    /* Estilos para el demo credentials */
    [style*="demoCredentials"] p {
      margin: 8px 0;
      line-height: 1.6;
    }

    [style*="demoCredentials"] p:first-child {
      font-weight: bold;
      font-size: 1.05rem;
      color: #6D4C41;
      margin-bottom: 12px;
      text-align: center;
    }

    [style*="demoCredentials"] strong {
      color: #C62828;
      font-weight: 700;
    }

    /* Texto del formulario */
    [style*="form"] + p {
      color: #757575;
      font-size: 0.95rem;
    }

    /* Animación de entrada para el auth container */
    [style*="authContainer"] {
      animation: slideDown 0.6s ease-out;
    }

    /* Responsive */
    @media (max-width: 768px) {
      [style*="authContainer"] {
        margin: 30px 20px;
        padding: 30px 25px;
      }

      [style*="title"] {
        font-size: 1.7rem;
      }

      [style*="authContainer"]::before,
      [style*="authContainer"]::after {
        font-size: 3rem;
      }
    }

    @media (max-width: 480px) {
      [style*="authContainer"] {
        margin: 20px 15px;
        padding: 25px 20px;
        border-width: 3px;
      }

      [style*="title"] {
        font-size: 1.5rem;
      }

      [style*="input"] {
        padding: 12px 15px;
        font-size: 0.95rem;
      }

      [style*="primaryButton"] {
        padding: 13px;
        font-size: 1rem;
      }

      [style*="demoCredentials"] {
        padding: 15px;
        font-size: 0.9rem;
      }

      [style*="authContainer"]::before {
        top: -15px;
        right: -15px;
        font-size: 2.5rem;
      }

      [style*="authContainer"]::after {
        bottom: -15px;
        left: -15px;
        font-size: 2.5rem;
      }
    }
  `}
      </style>
    </>
  );

  const renderRegistro = () => (
    <>
      <div style={styles.authContainer}>
        <h1 style={styles.title}>📝 Registrarse</h1>

        <form onSubmit={handleRegistro} style={styles.form}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={formRegistro.nombre}
            onChange={(e) =>
              setFormRegistro({ ...formRegistro, nombre: e.target.value })
            }
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formRegistro.email}
            onChange={(e) =>
              setFormRegistro({ ...formRegistro, email: e.target.value })
            }
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={formRegistro.password}
            onChange={(e) =>
              setFormRegistro({ ...formRegistro, password: e.target.value })
            }
            style={styles.input}
            required
            minLength="6"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={formRegistro.telefono}
            onChange={(e) =>
              setFormRegistro({ ...formRegistro, telefono: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={formRegistro.direccion}
            onChange={(e) =>
              setFormRegistro({ ...formRegistro, direccion: e.target.value })
            }
            style={styles.input}
          />

          <button type="submit" style={styles.primaryButton}>
            Crear Cuenta
          </button>

          <p style={{ textAlign: "center", marginTop: "15px" }}>
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => setPagina("login")}
              style={styles.linkButton}
            >
              Inicia sesión aquí
            </button>
          </p>
        </form>
      </div>

      <style>
        {`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Decoración del contenedor */
        [style*="authContainer"] {
          position: relative;
          overflow: hidden;
        }

        [style*="authContainer"]::before {
          content: '🎂';
          position: absolute;
          top: -20px;
          right: -20px;
          font-size: 4rem;
          opacity: 0.15;
          transform: rotate(15deg);
          z-index: 1;
        }

        [style*="authContainer"]::after {
          content: '🍰';
          position: absolute;
          bottom: -20px;
          left: -20px;
          font-size: 4rem;
          opacity: 0.15;
          transform: rotate(-15deg);
          z-index: 1;
        }

        /* Focus en inputs */
        [style*="input"]:focus {
          outline: none;
          border-color: #F9A825;
          box-shadow: 0 0 0 3px rgba(249, 168, 37, 0.2);
          transform: translateY(-2px);
        }

        [style*="input"]:hover {
          border-color: #F9A825;
        }

        /* Hover en botón primario */
        [style*="primaryButton"] {
          position: relative;
          overflow: hidden;
        }

        [style*="primaryButton"]:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 25px rgba(198, 40, 40, 0.5);
          background: linear-gradient(135deg, #F9A825 0%, #C62828 100%);
        }

        [style*="primaryButton"]:active {
          transform: translateY(-1px);
        }

        /* Efecto de brillo en botón */
        [style*="primaryButton"]::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.6s;
          z-index: 1;
        }

        [style*="primaryButton"]:hover::before {
          left: 100%;
        }

        /* Hover en link button */
        [style*="linkButton"]:hover {
          color: #F9A825;
          text-decoration-color: #F9A825;
        }

        /* Animación de entrada para el auth container */
        [style*="authContainer"] {
          animation: slideDown 0.6s ease-out;
        }

        /* Responsive */
        @media (max-width: 768px) {
          [style*="authContainer"] {
            margin: 30px 20px;
            padding: 30px 25px;
          }

          [style*="title"] {
            font-size: 1.7rem;
          }

          [style*="authContainer"]::before,
          [style*="authContainer"]::after {
            font-size: 3rem;
          }
        }

        @media (max-width: 480px) {
          [style*="authContainer"] {
            margin: 20px 15px;
            padding: 25px 20px;
            border-width: 3px;
          }

          [style*="title"] {
            font-size: 1.5rem;
          }

          [style*="input"] {
            padding: 12px 15px;
            font-size: 0.95rem;
          }

          [style*="primaryButton"] {
            padding: 13px;
            font-size: 1rem;
          }

          [style*="authContainer"]::before {
            top: -15px;
            right: -15px;
            font-size: 2.5rem;
          }

          [style*="authContainer"]::after {
            bottom: -15px;
            left: -15px;
            font-size: 2.5rem;
          }
        }
      `}
      </style>
    </>
  );

  const renderPerfil = () => (
    <>
      <div style={styles.container}>
        <h1 style={styles.title}>👤 Tu Perfil</h1>

        {usuario && (
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.profileAvatar}>{usuario.nombre.charAt(0)}</div>
              <h2>{usuario.nombre}</h2>
              <p style={styles.profileEmail}>{usuario.email}</p>
            </div>

            <div style={styles.profileInfo}>
              <div style={styles.infoRow}>
                <strong>Teléfono:</strong>
                <span>{usuario.telefono || "No registrado"}</span>
              </div>
              <div style={styles.infoRow}>
                <strong>Dirección:</strong>
                <span>{usuario.direccion || "No registrada"}</span>
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
                  alert("Función de edición de perfil en desarrollo");
                }}
              >
                Editar Perfil
              </button>
              <button
                style={styles.secondaryButton}
                onClick={() => {
                  // Aquí podrías implementar ver historial de compras
                  alert("Historial de compras en desarrollo");
                }}
              >
                Ver Mis Compras
              </button>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* Decoración del perfil */
        [style*="profileCard"] {
          position: relative;
          overflow: hidden;
          animation: scaleIn 0.6s ease-out;
        }

        [style*="profileCard"]::before {
          content: '👨‍🍳';
          position: absolute;
          top: -25px;
          right: -25px;
          font-size: 5rem;
          opacity: 0.1;
          transform: rotate(20deg);
          z-index: 0;
        }

        [style*="profileCard"]::after {
          content: '🎂';
          position: absolute;
          bottom: -25px;
          left: -25px;
          font-size: 5rem;
          opacity: 0.1;
          transform: rotate(-20deg);
          z-index: 0;
        }

        /* Estilos para el avatar */
        [style*="profileAvatar"] {
          animation: pulse 2s infinite ease-in-out;
          border: 3px solid #F9A825;
          box-shadow: 0 4px 12px rgba(249, 168, 37, 0.4);
        }

        [style*="profileAvatar"]:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(249, 168, 37, 0.6);
        }

        /* Estilos para la información */
        [style*="profileInfo"] {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        [style*="infoRow"] {
          transition: all 0.3s ease;
          border-bottom: 2px solid #F5E2C8;
        }

        [style*="infoRow"]:hover {
          background-color: rgba(249, 168, 37, 0.05);
          border-bottom-color: #F9A825;
          transform: translateX(5px);
          padding-left: 10px;
          border-radius: 5px;
        }

        [style*="infoRow"] strong {
          color: #C62828;
          font-weight: 700;
        }

        [style*="infoRow"] span {
          color: #212121;
          font-weight: 500;
        }

        /* Estilos para los botones de acción */
        [style*="secondaryButton"] {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        [style*="secondaryButton"]:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(198, 40, 40, 0.3);
          background-color: #FFFFFF;
          color: #C62828;
          border-color: #F9A825;
        }

        [style*="secondaryButton"]::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(249, 168, 37, 0.3), transparent);
          transition: left 0.6s;
          z-index: 1;
        }

        [style*="secondaryButton"]:hover::before {
          left: 100%;
        }

        /* Estilos para el header */
        [style*="profileHeader"] {
          animation: slideDown 0.6s ease-out;
        }

        [style*="profileHeader"] h2 {
          color: #C62828;
          text-shadow: 1px 1px 2px rgba(198, 40, 40, 0.2);
        }

        [style*="profileEmail"] {
          color: #757575;
          transition: color 0.3s ease;
        }

        [style*="profileEmail"]:hover {
          color: #F9A825;
        }

        /* Responsive */
        @media (max-width: 768px) {
          [style*="profileCard"] {
            margin: 20px;
            padding: 25px;
          }

          [style*="profileCard"]::before,
          [style*="profileCard"]::after {
            font-size: 3.5rem;
          }

          [style*="profileAvatar"] {
            width: 70px;
            height: 70px;
            font-size: 1.8rem;
          }

          [style*="profileActions"] {
            flex-direction: column;
            gap: 12px;
          }

          [style*="secondaryButton"] {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          [style*="profileCard"] {
            margin: 15px;
            padding: 20px;
          }

          [style*="title"] {
            font-size: 1.8rem;
          }

          [style*="profileCard"]::before,
          [style*="profileCard"]::after {
            font-size: 2.5rem;
          }

          [style*="profileCard"]::before {
            top: -15px;
            right: -15px;
          }

          [style*="profileCard"]::after {
            bottom: -15px;
            left: -15px;
          }

          [style*="profileAvatar"] {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }

          [style*="profileHeader"] h2 {
            font-size: 1.4rem;
          }

          [style*="infoRow"] {
            font-size: 0.95rem;
            padding: 8px 0;
          }
        }
      `}
      </style>
    </>
  );

  return (
    <div style={styles.app}>
      {renderNavbar()}

      <main style={styles.main}>
        {pagina === "inicio" && renderInicio()}
        {pagina === "productos" && renderProductos()}
        {pagina === "carrito" && renderCarrito()}
        {pagina === "login" && renderLogin()}
        {pagina === "registro" && renderRegistro()}
        {pagina === "perfil" && renderPerfil()}
      </main>

      <footer style={styles.footer}>
        <p>🥪 Tortas Molina - Sistema de Ventas © 2025</p>
        <p>
          Sistema desarrollado para la gestión de ventas de tortas artesanales
        </p>
      </footer>

      <style>
        {`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* Aplica animación a las cards usando selectores de atributo */
        [style*="productCard"] {
          animation: fadeInUp 0.6s ease-out !important;
        }

        [style*="productCard"]:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 12px 30px rgba(198, 40, 40, 0.25) !important;
          border-color: #F9A825 !important;
        }

        [style*="productImage"]:hover {
          transform: scale(1.1) !important;
        }

        [style*="productName"]:hover {
          color: #C62828 !important;
        }

        [style*="productPrice"] {
          animation: pulse 2s ease-in-out infinite !important;
        }

        [style*="addToCartButton"]:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(198, 40, 40, 0.5) !important;
          background: linear-gradient(135deg, #F9A825 0%, #C62828 100%) !important;
        }

        [style*="addToCartButton"]:active:not(:disabled) {
          transform: translateY(0) !important;
        }

        [style*="addToCartButton"]:disabled {
          cursor: not-allowed !important;
          background: #757575 !important;
          border-color: #757575 !important;
        }

        [style*="addToCartButton"]:not(:disabled)::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        [style*="addToCartButton"]:not(:disabled):hover::before {
          left: 100%;
        }

        /* Responsive */
        @media (max-width: 768px) {
          [style*="productGrid"] {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
            gap: 20px !important;
          }
          
          [style*="title"] {
            font-size: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          [style*="productGrid"] {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 5px !important;
          }
          
          [style*="productImage"] {
            height: 180px !important;
          }
          
          [style*="productInfo"] {
            padding: 20px !important;
          }
          
          [style*="productPrice"] {
            font-size: 1.5rem !important;
          }
        }
        

      `}
      </style>
    </div>
  );
}

// Estilos CSS-in-JS
const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    background: "linear-gradient(135deg, #C62828 0%, #F9A825 100%)",
    color: "#FFFFFF",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(198, 40, 40, 0.3)",
    borderBottom: "3px solid #2E7D32",
    position: "relative",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "1.8rem",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#FFFFFF",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    transition: "transform 0.3s ease",
  },
  logoImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #FFFFFF",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  navLinks: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  navButton: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "2px solid rgba(255, 255, 255, 0.4)",
    color: "#FFFFFF",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
    backdropFilter: "blur(5px)",
  },
  logoutButton: {
    background: "#212121",
    border: "2px solid #757575",
    color: "#FFFFFF",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  registerButton: {
    background: "#2E7D32",
    border: "2px solid #1B5E20",
    color: "#FFFFFF",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 6px rgba(46, 125, 50, 0.4)",
  },
  main: {
    flex: 1,
    padding: "20px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  hero: {
    textAlign: "center",
    padding: "60px 30px",
    background: "linear-gradient(135deg, #F9A825 0%, #C62828 100%)",
    borderRadius: "15px",
    marginBottom: "40px",
    boxShadow: "0 8px 25px rgba(198, 40, 40, 0.3)",
    border: "4px solid #2E7D32",
    position: "relative",
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: "2.8rem",
    marginBottom: "15px",
    color: "#FFFFFF",
    textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
    fontWeight: "bold",
  },
  heroSubtitle: {
    fontSize: "1.4rem",
    color: "#F5E2C8",
    marginBottom: "25px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    fontWeight: "500",
  },
  statusBox: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "15px 25px",
    borderRadius: "10px",
    display: "inline-block",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    border: "2px solid #F5E2C8",
    color: "#212121",
    fontWeight: "600",
  },
  features: {
    marginBottom: "50px",
    padding: "20px",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    marginTop: "30px",
  },
  featureCard: {
    background: "#FFFFFF",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    border: "3px solid #F5E2C8",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  quickActions: {
    textAlign: "center",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #F5E2C8 0%, #FFFFFF 100%)",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    border: "3px solid #F9A825",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "25px",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "10px",
    color: "#C62828",
    textAlign: "center",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(198, 40, 40, 0.2)",
    position: "relative",
    display: "inline-block",
    width: "100%",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#414141",
    marginBottom: "40px",
    textAlign: "center",
    fontWeight: "500",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "30px",
    padding: "10px",
  },
  productCard: {
    background: "#FFFFFF",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    border: "3px solid #F5E2C8",
    position: "relative",
    cursor: "pointer",
    animation: "fadeInUp 0.6s ease-out",
  },
  productImage: {
    height: "220px",
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#F5E2C8",
    position: "relative",
    transition: "transform 0.4s ease",
    background: "linear-gradient(135deg, #F9A825 0%, #F5E2C8 100%)",
  },
  productInfo: {
    padding: "25px",
    background: "#FFFFFF",
  },
  productName: {
    fontSize: "1.4rem",
    marginBottom: "12px",
    color: "#212121",
    fontWeight: "bold",
    transition: "color 0.3s ease",
  },
  productDesc: {
    color: "#757575",
    fontSize: "0.95rem",
    marginBottom: "18px",
    minHeight: "45px",
    lineHeight: "1.5",
  },
  productDetails: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    padding: "12px 0",
    borderTop: "2px solid #F5E2C8",
    borderBottom: "2px solid #F5E2C8",
  },
  productPrice: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#2E7D32",
    textShadow: "1px 1px 2px rgba(46, 125, 50, 0.2)",
  },
  productStock: {
    background: "linear-gradient(135deg, #F9A825 0%, #F5E2C8 100%)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    color: "#6D4C41",
    fontWeight: "600",
    border: "2px solid #F9A825",
  },
  addToCartButton: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #C62828 0%, #F9A825 100%)",
    color: "#FFFFFF",
    border: "3px solid #2E7D32",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1.05rem",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(198, 40, 40, 0.3)",
    textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
    position: "relative",
    overflow: "hidden",
  },
  authContainer: {
    maxWidth: "450px",
    margin: "50px auto",
    padding: "40px",
    background: "linear-gradient(135deg, #FFFFFF 0%, #F5E2C8 100%)",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(198, 40, 40, 0.25)",
    border: "4px solid #C62828",
    animation: "slideDown 0.6s ease-out",
    position: "relative",
    overflow: "hidden",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  input: {
    padding: "15px 18px",
    border: "3px solid #F5E2C8",
    borderRadius: "10px",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    background: "#FFFFFF",
    color: "#212121",
    fontWeight: "500",
  },
  primaryButton: {
    padding: "15px 35px",
    background: "linear-gradient(135deg, #C62828 0%, #F9A825 100%)",
    color: "#FFFFFF",
    border: "3px solid #2E7D32",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(198, 40, 40, 0.4)",
    transition: "all 0.3s ease",
    textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
  },
  secondaryButton: {
    padding: "15px 35px",
    background: "#FFFFFF",
    color: "#C62828",
    border: "3px solid #C62828",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#C62828",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "color 0.3s ease",
  },
  demoCredentials: {
    marginTop: "30px",
    padding: "20px",
    background: "linear-gradient(135deg, #F9A825 0%, #F5E2C8 100%)",
    borderRadius: "12px",
    fontSize: "0.95rem",
    border: "3px solid #F9A825",
    boxShadow: "0 3px 10px rgba(249, 168, 37, 0.3)",
    color: "#6D4C41",
  },
  emptyCart: {
    textAlign: "center",
    padding: "80px 20px",
    background: "linear-gradient(135deg, #F5E2C8 0%, #FFFFFF 100%)",
    borderRadius: "15px",
    border: "4px solid #F9A825",
    boxShadow: "0 6px 20px rgba(249, 168, 37, 0.3)",
    animation: "fadeIn 0.5s ease-out",
  },
  cartItems: {
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  cartItem: {
    display: "flex",
    background: "#FFFFFF",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
    border: "3px solid #F5E2C8",
    transition: "all 0.3s ease",
    animation: "slideInLeft 0.5s ease-out",
    position: "relative",
  },
  cartItemImage: {
    width: "100px",
    height: "100px",
    background: "linear-gradient(135deg, #F9A825 0%, #F5E2C8 100%)",
    borderRadius: "10px",
    marginRight: "20px",
    flexShrink: 0,
    border: "2px solid #F9A825",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  cartItemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    color: "#212121",
  },
  cartSummary: {
    background: "linear-gradient(135deg, #FFFFFF 0%, #F5E2C8 100%)",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 6px 25px rgba(198, 40, 40, 0.25)",
    border: "4px solid #C62828",
    animation: "scaleIn 0.6s ease-out",
    position: "sticky",
    top: "20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    marginTop: "20px",
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#212121",
    padding: "15px 0",
    borderTop: "3px solid #F9A825",
    borderBottom: "3px solid #F9A825",
  },
  totalAmount: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#2E7D32",
    textShadow: "2px 2px 4px rgba(46, 125, 50, 0.2)",
    animation: "pulse 2s ease-in-out infinite",
  },
  buyButton: {
    width: "100%",
    padding: "18px",
    background: "linear-gradient(135deg, #2E7D32 0%, #F9A825 100%)",
    color: "#FFFFFF",
    border: "3px solid #C62828",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: "bold",
    boxShadow: "0 5px 15px rgba(46, 125, 50, 0.4)",
    transition: "all 0.3s ease",
    textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
    position: "relative",
    overflow: "hidden",
  },
  profileCard: {
    background: "white",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "0 auto",
  },
  profileHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },
  profileAvatar: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    color: "white",
    margin: "0 auto 15px",
  },
  profileEmail: {
    color: "#666",
  },
  profileInfo: {
    marginBottom: "30px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  profileActions: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
  },
  footer: {
    background: "#333",
    color: "white",
    textAlign: "center",
    padding: "20px",
    marginTop: "40px",
  },
  productImageContainer: {
    height: "220px",
    overflow: "hidden",
    position: "relative",
  },

  productImageTag: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transition: "transform 0.4s ease",
  },
};

export default App;
