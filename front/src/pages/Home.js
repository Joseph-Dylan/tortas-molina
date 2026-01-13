import React from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: "🥪",
      title: "Productos Frescos",
      description: "Las mejores tortas artesanales de la ciudad",
    },
    {
      icon: "🚀",
      title: "Envío Rápido",
      description: "Recibe tu pedido en tiempo récord",
    },
    {
      icon: "💳",
      title: "Pago Seguro",
      description: "Múltiples métodos de pago disponibles",
    },
    {
      icon: "⭐",
      title: "Calidad Garantizada",
      description: "Satisfacción 100% garantizada",
    },
  ];

  return (
    <Container>
      {/* Hero Section */}
      <div
        className="text-center py-5 mb-5 rounded"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <h1 className="display-4 fw-bold mb-3">
          Bienvenido a Tortas Molina la Güera
        </h1>
        <p className="lead mb-4">Las mejores tortas artesanales de la ciudad</p>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Button
            variant="light"
            size="lg"
            onClick={() => navigate(ROUTES.PRODUCTS)}
          >
            Ver Productos
          </Button>

          {!user && (
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              Crear Cuenta
            </Button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-5">
        <h2 className="text-center mb-4">¿Por qué elegirnos?</h2>
        <Row>
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card className="h-100 text-center shadow-sm border-0">
                <Card.Body>
                  <div style={{ fontSize: "3rem" }} className="mb-3">
                    {feature.icon}
                  </div>
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {feature.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Section */}
      <div className="text-center py-5 rounded bg-light">
        <h2 className="mb-3">¿Listo para ordenar?</h2>
        <p className="text-muted mb-4">
          Explora nuestro catálogo y haz tu pedido ahora
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(ROUTES.PRODUCTS)}
        >
          Explorar Productos
        </Button>
      </div>
    </Container>
  );
};

export default Home;
