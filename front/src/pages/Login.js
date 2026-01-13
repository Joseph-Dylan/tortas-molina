import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks";
import { validateLoginForm } from "../utils/validation";
import { ROUTES } from "../utils/constants";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = useForm({ email: "", password: "" }, validateLoginForm);

  const onSubmit = async (formData) => {
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <Card className="shadow">
            <Card.Body className="p-4">
              <Card.Title className="text-center mb-4">
                <h2>Iniciar Sesión</h2>
              </Card.Title>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!getFieldError("email")}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("email")}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!getFieldError("password")}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("password")}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
                </Button>

                <div className="text-center">
                  <p className="text-muted mb-2">
                    ¿No tienes cuenta?{" "}
                    <Link to={ROUTES.REGISTER}>Regístrate aquí</Link>
                  </p>
                </div>
              </Form>

              {/* Credenciales de prueba */}
              <div className="mt-4 p-3 bg-light rounded">
                <p className="small mb-1 text-muted">
                  <strong>Credenciales de prueba:</strong>
                </p>
                <p className="small mb-0">
                  Email: <code>cliente@tortas.com</code>
                  <br />
                  Contraseña: <code>123456</code>
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
