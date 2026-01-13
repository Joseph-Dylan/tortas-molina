import React, { useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks";
import { validateProfileForm } from "../utils/validation";

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const {
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    setValues,
  } = useForm(
    {
      nombre: "",
      telefono: "",
      direccion: "",
    },
    validateProfileForm
  );

  // Cargar datos del usuario cuando cambie
  useEffect(() => {
    if (user) {
      setValues({
        nombre: user.nombre || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
      });
    }
  }, [user, setValues]);

  const onSubmit = async (formData) => {
    await updateProfile(formData);
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center">
        <Alert variant="warning">Cargando perfil...</Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card className="shadow">
            <Card.Body className="p-4">
              <Card.Title className="text-center mb-4">
                <h2>Mi Perfil</h2>
              </Card.Title>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
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
                    value={user.email}
                    disabled
                    readOnly
                    className="bg-light"
                  />
                  <Form.Text className="text-muted">
                    El email no se puede modificar
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
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
                  <Form.Label>Teléfono</Form.Label>
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
                  className="w-100"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar Perfil"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
