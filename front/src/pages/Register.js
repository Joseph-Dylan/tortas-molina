import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks";
import { validateRegisterForm } from "../utils/validation";
import { ROUTES } from "../utils/constants";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
  } = useForm(
    {
      nombre: "",
      email: "",
      password: "",
      confirmPassword: "",
      direccion: "",
      telefono: "",
    },
    validateRegisterForm
  );

  const onSubmit = async (formData) => {
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card className="shadow">
            <Card.Body className="p-4">
              <Card.Title className="text-center mb-4">
                <h2>Crear Cuenta</h2>
              </Card.Title>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    placeholder="Juan Pérez"
                    value={values.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!getFieldError("nombre")}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("nombre")}
                  </Form.Control.Feedback>
                </Form.Group>

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

                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!getFieldError("confirmPassword")}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("confirmPassword")}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección (opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="direccion"
                    placeholder="Calle, número, colonia..."
                    value={values.direccion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!getFieldError("direccion")}
                    disabled={isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("direccion")}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono (opcional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    placeholder="5512345678"
                    value={values.telefono}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!getFieldError("telefono")}
                    disabled={isSubmitting}
                    maxLength={10}
                  />
                  <Form.Control.Feedback type="invalid">
                    {getFieldError("telefono")}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Debe tener 10 dígitos
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registrando..." : "Registrarse"}
                </Button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    ¿Ya tienes cuenta?{" "}
                    <Link to={ROUTES.LOGIN}>Inicia Sesión</Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
