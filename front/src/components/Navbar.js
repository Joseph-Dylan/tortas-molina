import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaHome,
  FaBox,
  FaStore,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NavigationBar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cart.items.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  // Función para obtener el nombre a mostrar (primer nombre o nombre truncado)
  const getDisplayName = () => {
    if (!user || !user.nombre) return "Usuario";

    // Obtener solo el primer nombre
    const firstName = user.nombre.split(" ")[0];

    // Si el primer nombre es muy largo, truncarlo
    if (firstName.length > 12) {
      return firstName.substring(0, 10) + "...";
    }

    return firstName;
  };

  // Función para obtener el nombre completo para el tooltip
  const getFullName = () => {
    return user?.nombre || "Usuario";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar
      bg="orange"
      variant="dark"
      expand="lg"
      style={{
        background: "linear-gradient(135deg, #ff7b00 0%, #ff5500 100%)",
        boxShadow: "0 4px 12px rgba(255, 107, 0, 0.3)",
        borderBottom: "3px solid #ff8c00",
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center fw-bold fs-3"
          style={{ color: "#fff", textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}
        >
          <FaStore className="me-2" />
          Tortas Molina
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ borderColor: "#fff" }}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="d-flex align-items-center gap-2 text-white fw-semibold"
              style={{
                transition: "all 0.3s",
                borderRadius: "5px",
                padding: "8px 12px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FaHome />
              Inicio
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/products"
              className="d-flex align-items-center gap-2 text-white fw-semibold"
              style={{
                transition: "all 0.3s",
                borderRadius: "5px",
                padding: "8px 12px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FaBox />
              Productos
            </Nav.Link>

            {isAdmin && (
              <Nav.Link
                as={Link}
                to="/admin"
                className="d-flex align-items-center gap-2 text-white fw-semibold"
                style={{
                  transition: "all 0.3s",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  backgroundColor: "rgba(255, 69, 0, 0.3)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255, 69, 0, 0.5)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255, 69, 0, 0.3)")
                }
              >
                <FaCog />
                Panel Admin
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center">
            {user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/cart"
                  className="position-relative mx-2"
                  style={{
                    transition: "transform 0.3s",
                    borderRadius: "50%",
                    width: "45px",
                    height: "45px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.1)";
                  }}
                >
                  <FaShoppingCart size={20} style={{ color: "#fff" }} />

                  {cartItemCount > 0 && (
                    <Badge
                      pill
                      style={{
                        backgroundColor: "#ff3333",
                        border: "2px solid #fff",
                        fontSize: "0.7rem",
                        minWidth: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/orders"
                  className="text-white fw-semibold mx-2"
                  style={{
                    transition: "all 0.3s",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    backgroundColor: "rgba(255,165,0,0.2)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,165,0,0.4)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,165,0,0.2)")
                  }
                >
                  Mis Compras
                </Nav.Link>

                {/* Perfil del usuario con tooltip para nombres largos */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="user-tooltip">{getFullName()}</Tooltip>}
                >
                  <Nav.Link
                    as={Link}
                    to="/profile"
                    className="d-flex align-items-center gap-2 text-white fw-semibold mx-2"
                    style={{
                      transition: "all 0.3s",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      backgroundColor: "rgba(255,140,0,0.2)",
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255,140,0,0.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255,140,0,0.2)")
                    }
                  >
                    <FaUser />
                    <span
                      style={{
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {getDisplayName()}
                    </span>
                  </Nav.Link>
                </OverlayTrigger>

                <Nav.Link
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2 text-white fw-semibold mx-2"
                  style={{
                    transition: "all 0.3s",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    backgroundColor: "rgba(255, 69, 0, 0.3)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255, 69, 0, 0.5)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255, 69, 0, 0.3)")
                  }
                >
                  <FaSignOutAlt />
                  Salir
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="text-white fw-semibold mx-2"
                  style={{
                    transition: "all 0.3s",
                    borderRadius: "20px",
                    padding: "8px 20px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.2)")
                  }
                >
                  Iniciar Sesión
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/register"
                  className="text-white fw-semibold mx-2"
                  style={{
                    transition: "all 0.3s",
                    borderRadius: "20px",
                    padding: "8px 20px",
                    backgroundColor: "#ff6b00",
                    border: "2px solid #ff8c00",
                    boxShadow: "0 2px 8px rgba(255,107,0,0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ff8c00";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(255,107,0,0.6)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ff6b00";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(255,107,0,0.4)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
