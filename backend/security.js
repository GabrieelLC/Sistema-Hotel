/**
 * security.js - Funções de segurança (bcrypt, JWT, RBAC)
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-2024';
const TOKEN_EXPIRY = '7d'; // 7 dias

/**
 * Hash de senha com bcrypt
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Comparar senha com hash
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Gerar JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      usuario: user.usuario,
      nivel_acesso: user.nivel_acesso,
      nome: user.nome,
    },
    SECRET_KEY,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Verificar JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

/**
 * Middleware: Verificar autenticação
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }

  req.user = decoded;
  next();
}

/**
 * Middleware: Verificar se é admin
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.nivel_acesso !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Requer nível admin' });
  }
  next();
}

/**
 * Middleware: Verificar se é admin ou gerente
 */
function requireAdminOrGerente(req, res, next) {
  if (!req.user || (req.user.nivel_acesso !== 'admin' && req.user.nivel_acesso !== 'gerente')) {
    return res.status(403).json({ message: 'Acesso negado. Requer nível admin ou gerente' });
  }
  next();
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  requireAuth,
  requireAdmin,
  requireAdminOrGerente,
};
