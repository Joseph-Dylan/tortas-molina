
const jwt = require("jsonwebtoken");
// ==========================================
// MIDDLEWARE DE AUTORIZACION
// ==========================================
exports.verifyToken = (req, res, next) => {
  try {
    console.log('🔐 [DEBUG] ========== VERIFYTOKEN INICIO ==========');
    console.log('🔐 [DEBUG] URL:', req.originalUrl);
    console.log('🔐 [DEBUG] Método:', req.method);
    console.log('🔐 [DEBUG] Headers completos:', JSON.stringify(req.headers, null, 2));
    
    const authHeader = req.headers.authorization;
    console.log('🔐 [DEBUG] Auth Header:', authHeader);
    
    if (!authHeader) {
      console.log('❌ [DEBUG] NO HAY Authorization header');
      return res.status(401).json({ error: "Token requerido" });
    }
    
    const token = authHeader.split(" ")[1];
    console.log('🔐 [DEBUG] Token extraído:', token ? `SÍ (${token.length} chars)` : 'NO');
    console.log('🔐 [DEBUG] Token preview:', token?.substring(0, 50) + '...');
    
    if (!token) {
      console.log('❌ [DEBUG] Token vacío después de split');
      return res.status(401).json({ error: "Token requerido" });
    }

    console.log('🔐 [DEBUG] JWT_SECRET definido?:', !!process.env.JWT_SECRET);
    console.log('🔐 [DEBUG] JWT_SECRET:', process.env.JWT_SECRET ? '***' + process.env.JWT_SECRET.substring(process.env.JWT_SECRET.length - 5) : 'NO DEFINIDO');
    
    // ✨ PRUEBA: Decodificar SIN verificar primero
    const decodedWithoutVerify = jwt.decode(token);
    console.log('🔐 [DEBUG] Decoded sin verificar:', decodedWithoutVerify);
    
    // Ahora verificar
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ [DEBUG] Token VÁLIDO - Decoded:', decoded);
    
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    console.log('✅ [DEBUG] Auth EXITOSA - userId:', req.userId, 'rol:', req.userRol);
    console.log('🔐 [DEBUG] ========== VERIFYTOKEN FIN ==========\n');
    
    next();
  } catch (error) {
    console.error('❌ [DEBUG] ========== ERROR EN VERIFYTOKEN ==========');
    console.error('❌ [DEBUG] Error:', error.message);
    console.error('❌ [DEBUG] Error stack:', error.stack);
    console.error('❌ [DEBUG] Token que falló:', req.headers.authorization?.split(" ")[1]?.substring(0, 50) + '...');
    console.error('❌ [DEBUG] =========================================\n');
    
    return res.status(401).json({ 
      error: "Token inválido o expirado",
      details: error.message 
    });
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