
// ==========================================
// MIDDLEWARE DE AUTORIZACION
// ==========================================
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Acceso no autorizado. Token requerido." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.userRol !== "admin") {
    console.log("No es admin");
    return res.status(403).json({ 
      error: "Acceso denegado. Se requiere rol de administrador" 
    });
  }
  console.log("Es admin");
  next();
};