import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        direccion: user.direccion || '',
        telefono: user.telefono || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await updateProfile(formData);
    if (result.success) {
      setMessage('Perfil actualizado exitosamente');
    }

    setLoading(false);
  };

  if (!user) {
    return <Alert variant="warning">Cargando perfil...</Alert>;
  }

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '500px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Mi Perfil</Card.Title>
          
          {message && (
            <Alert variant="success">{message}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                disabled
                readOnly
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
                value={formData.direccion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Actualizar Perfil'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;