const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

// Registrar usuario
exports.registrar = async (req, res) => {
  try {
    const { nombre, email, password, telefono, direccion } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password || !telefono || !direccion) {
      return res.status(400).json({
        error: "Nombre, email, password, telefono y direccion son requeridos",
      });
    }

    console.log("Datos recibidos: ", req.body);

    //Validar que la direccion del correo electronico sea correcta.
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    if (!email.match(regex)) {
      return res.status(400).json({ error: "El email no es valido" });
    }

    if (telefono.length !== 10) {
      return res
        .status(400)
        .json({ error: "El número de teléfono debe tener 10 dígitos" });
    }

    // Verificar si el usuario ya existe
    const [existing] = await pool.execute(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.execute(
      "INSERT INTO usuarios (nombre, email, password, telefono, direccion) VALUES (?, ?, ?, ?, ?)",
      [nombre, email, hashedPassword, telefono || null, direccion || null]
    );

    // Generar token
    const token = jwt.sign(
      { id: result.insertId, email, rol: "cliente" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    if (!token) {
      return res.status(500).json({ error: "Error en el servidor" });
    }

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      usuario: {
        id: result.insertId,
        nombre,
        email,
        telefono,
        direccion,
        rol: "cliente",
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Datos recibidos: ", req.body);

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ error: "Email y password son requeridos" });
    }

    // Buscar usuario
    const [users] = await pool.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const usuario = users[0];

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
      },
    });

    console.log("Usuario: " + usuario);
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Obtener perfil
exports.perfil = async (req, res) => {
  try {
    const [users] = await pool.execute(
      "SELECT id, nombre, email, telefono, direccion, rol, created_at FROM usuarios WHERE id = ?",
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    console.log("Perfil del usuario: ", users[0]);
    res.json(users[0]);
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Actualizar perfil
exports.actualizarPerfil = async (req, res) => {
  try {
    const { nombre, telefono, direccion } = req.body;

    if (!nombre || !telefono || !direccion) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    if (telefono.length !== 10) {
      return res
        .status(400)
        .json({ error: "El número de teléfono debe tener 10 dígitos" });
    }

    const [result] = await pool.execute(
      "UPDATE usuarios SET nombre = ?, telefono = ?, direccion = ? WHERE id = ?",
      [nombre, telefono, direccion, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Perfil actualizado exitosamente" });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
