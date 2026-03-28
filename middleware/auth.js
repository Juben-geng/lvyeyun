// middleware/auth.js — JWT Token 鉴权中间件
// 用于保护需要登录才能访问的 API 路由

const { validateToken, hasPermission, ROLES } = require('../auth');

/**
 * 认证中间件 — 验证请求中的 Token
 * 从 Header (Authorization: Bearer <token>) 或 Query (?token=xxx) 获取
 */
function requireAuth(req, res, next) {
  const token =
    (req.headers.authorization && req.headers.authorization.replace('Bearer ', '')) ||
    req.query.token ||
    req.body?.token;

  if (!token) {
    return res.status(401).json({ error: '请先登录', code: 'AUTH_REQUIRED' });
  }

  const userId = validateToken(token);
  if (!userId) {
    return res.status(401).json({ error: '登录已过期，请重新登录', code: 'TOKEN_EXPIRED' });
  }

  req.userId = userId;
  next();
}

/**
 * 角色权限中间件 — 检查用户是否拥有指定角色（或更高）
 * @param {string} requiredRole - 要求的最低角色
 */
function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.userId) {
      return res.status(401).json({ error: '请先登录', code: 'AUTH_REQUIRED' });
    }

    if (!hasPermission(req.userId, requiredRole)) {
      return res.status(403).json({
        error: '权限不足',
        code: 'PERMISSION_DENIED',
        required: requiredRole,
        yourRole: ROLES[getUserCurrentRole(req.userId)] || 'user',
      });
    }

    next();
  };
}

function getUserCurrentRole(userId) {
  // 从 auth 模块获取用户当前角色（轻量版，不引入整个模块）
  const { getUser } = require('../auth');
  const user = getUser(userId);
  return user?.role || 'user';
}

/**
 * 可选认证中间件 — 如果有 Token 就解析用户信息，没有也放行
 */
function optionalAuth(req, res, next) {
  const token =
    (req.headers.authorization && req.headers.authorization.replace('Bearer ', '')) ||
    req.query.token;

  if (token) {
    const userId = validateToken(token);
    if (userId) req.userId = userId;
  }

  next();
}

module.exports = { requireAuth, requireRole, optionalAuth };
