import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form, Modal, Badge } from "react-bootstrap";
import { adminService } from "../../services";
import { productService } from "../../services";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
    stock: "",
    peso_kg: "0.5",
    imagen_url: "/imagenes-tortas/default.jpg",
    ingredientes: ""
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        productService.getAll(),
        adminService.obtenerCategorias()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (error) {
      toast.error("Error al cargar datos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value
    });
  };

  const crearProducto = async () => {
    try {
      await adminService.crearProducto(nuevoProducto);
      toast.success("Producto creado exitosamente");
      setShowModal(false);
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria_id: "",
        stock: "",
        peso_kg: "0.5",
        imagen_url: "/imagenes-tortas/default.jpg",
        ingredientes: ""
      });
      cargarDatos();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al crear producto");
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await adminService.eliminarProducto(id);
        toast.success("Producto eliminado");
        cargarDatos();
      } catch (error) {
        toast.error(error.response?.data?.error || "Error al eliminar");
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Gestión de Productos</h3>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Nuevo Producto
        </Button>
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <Row>
          {productos.map((producto) => (
            <Col md={4} key={producto.id} className="mb-4">
              <Card>
                <Card.Img 
                  variant="top" 
                  src={producto.imagen_url} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{producto.nombre}</Card.Title>
                  <Card.Text>
                    <strong>${producto.precio}</strong>
                    <br/>
                    <Badge bg={producto.stock > 5 ? "success" : "warning"}>
                      Stock: {producto.stock}
                    </Badge>
                    <br/>
                    {producto.categoria_nombre}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => window.location.href = `/admin/productos/editar/${producto.id}`}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal para nuevo producto */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={nuevoProducto.descripcion}
                onChange={handleInputChange}
                rows={2}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio *</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={nuevoProducto.precio}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={nuevoProducto.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="categoria_id"
                value={nuevoProducto.categoria_id}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen URL</Form.Label>
              <Form.Control
                type="text"
                name="imagen_url"
                value={nuevoProducto.imagen_url}
                onChange={handleInputChange}
                placeholder="/imagenes-tortas/default.jpg"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={crearProducto}>
            Crear Producto
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProducts;