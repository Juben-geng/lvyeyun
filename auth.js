// auth.js — 🦞 用户认证系统
// 支持邮箱注册登录 + 微信公众号扫码 + 会员等级 + 企业权限

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// ─────────────────────────────────────────────
// 内存数据存储（演示模式）
// ─────────────────────────────────────────────

const users = new Map();      // userId -> User
const tokens = new Map();     // token -> { userId, expires }
const codes = new Map();      // email/code -> { userId, expires }
const wechatSessions = new Map(); // state -> { createdAt }

// 会员等级定义
const MEMBERSHIP_LEVELS = {
  free:      { name: '免费会员', maxOrders: 3, discount: 1.0,  features: ['基础AI对话', '行程预览'] },
  silver:    { name: '银牌会员', maxOrders: 10, discount: 0.95, features: ['完整行程规划', '比价报价', '售后提醒'] },
  gold:      { name: '金牌会员', maxOrders: 50, discount: 0.9,  features: ['全部AI功能', '专属客服', '优先处理'] },
  platinum:  { name: '铂金会员', maxOrders: -1, discount: 0.85, features: ['全部功能', '企业专属Agent', 'API接口', '定制服务'] },
};

// 企业权限角色
const ROLES = {
  user:       '普通用户',
  member:     '会员用户',
  agent:      '旅行顾问',
  manager:    '部门经理',
  admin:      '系统管理员',
  superadmin: '超级管理员',
};

// 权限层级
const ROLE_HIERARCHY = ['user', 'member', 'agent', 'manager', 'admin', 'superadmin'];

// ─────────────────────────────────────────────
// 密码工具
// ─────────────────────────────────────────────

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// ─────────────────────────────────────────────
// Token 管理
// ─────────────────────────────────────────────

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function createSession(userId) {
  const token = generateToken();
  tokens.set(token, { userId, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 }); // 7天
  return token;
}

function validateToken(token) {
  const session = tokens.get(token);
  if (!session || session.expires < Date.now()) {
    tokens.delete(token);
    return null;
  }
  return session.userId;
}

function destroySession(token) {
  tokens.delete(token);
}

// ─────────────────────────────────────────────
// 邮箱验证码
// ─────────────────────────────────────────────

function generateVerifyCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createVerifyCode(email, userId) {
  const code = generateVerifyCode();
  codes.set(`${email}:${code}`, { userId, expires: Date.now() + 10 * 60 * 1000 }); // 10分钟
  return code;
}

function verifyCode(email, code) {
  const key = `${email}:${code}`;
  const entry = codes.get(key);
  if (!entry || entry.expires < Date.now()) {
    codes.delete(key);
    return null;
  }
  codes.delete(key);
  return entry.userId;
}

// ─────────────────────────────────────────────
// 微信公众号扫码
// ─────────────────────────────────────────────

function createWechatSession() {
  const state = crypto.randomBytes(16).toString('hex');
  wechatSessions.set(state, { createdAt: Date.now(), userId: null });
  return state;
}

function bindWechatSession(state, userId) {
  const session = wechatSessions.get(state);
  if (!session) return false;
  session.userId = userId;
  return true;
}

function getWechatSession(state) {
  return wechatSessions.get(state);
}

function cleanupWechatSessions() {
  const now = Date.now();
  for (const [state, session] of wechatSessions) {
    if (now - session.createdAt > 5 * 60 * 1000) { // 5分钟过期
      wechatSessions.delete(state);
    }
  }
}

// ─────────────────────────────────────────────
// 用户 CRUD
// ─────────────────────────────────────────────

async function register({ email, password, name, company }) {
  // 检查邮箱是否已存在
  for (const [, user] of users) {
    if (user.email === email) {
      return { error: '该邮箱已注册' };
    }
  }

  const userId = uuidv4();
  const hashed = await hashPassword(password);

  const user = {
    id: userId,
    email,
    password: hashed,
    name: name || email.split('@')[0],
    avatar: null,
    phone: null,
    wechatOpenId: null,
    company: company || null,
    role: 'user',
    membership: 'free',
    membershipExpires: null,
    verified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: null,
    metadata: {},
  };

  users.set(userId, user);
  return { user: sanitizeUser(user) };
}

async function login({ email, password }) {
  let found = null;
  for (const [, user] of users) {
    if (user.email === email) {
      found = user;
      break;
    }
  }

  if (!found) return { error: '邮箱或密码错误' };

  const valid = await verifyPassword(password, found.password);
  if (!valid) return { error: '邮箱或密码错误' };

  // 更新最后登录时间
  found.lastLogin = new Date().toISOString();
  users.set(found.id, found);

  const token = createSession(found.id);
  return { token, user: sanitizeUser(found) };
}

function getUser(userId) {
  const user = users.get(userId);
  return user ? sanitizeUser(user) : null;
}

function getUserByEmail(email) {
  for (const [, user] of users) {
    if (user.email === email) return sanitizeUser(user);
  }
  return null;
}

function updateUser(userId, updates) {
  const user = users.get(userId);
  if (!user) return null;

  const allowed = ['name', 'avatar', 'phone', 'company', 'metadata'];
  for (const key of allowed) {
    if (updates[key] !== undefined) user[key] = updates[key];
  }

  user.updatedAt = new Date().toISOString();
  users.set(userId, user);
  return sanitizeUser(user);
}

function updateMembership(userId, level, expiresAt) {
  const user = users.get(userId);
  if (!user) return null;

  if (!MEMBERSHIP_LEVELS[level]) return { error: '无效的会员等级' };

  user.membership = level;
  user.membershipExpires = expiresAt || null;
  user.updatedAt = new Date().toISOString();
  users.set(userId, user);
  return sanitizeUser(user);
}

function updateRole(userId, role) {
  const user = users.get(userId);
  if (!user) return null;

  if (!ROLES[role]) return { error: '无效的角色' };

  user.role = role;
  user.updatedAt = new Date().toISOString();
  users.set(userId, user);
  return sanitizeUser(user);
}

function deleteUser(userId) {
  return users.delete(userId);
}

// ─────────────────────────────────────────────
// 用户列表（后台管理用）
// ─────────────────────────────────────────────

function listUsers({ page = 1, pageSize = 20, role, membership, search }) {
  let list = Array.from(users.values());

  if (role) list = list.filter(u => u.role === role);
  if (membership) list = list.filter(u => u.membership === membership);
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }

  const total = list.length;
  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize).map(sanitizeUser);

  return { total, page, pageSize, items };
}

// ─────────────────────────────────────────────
// 权限检查
// ─────────────────────────────────────────────

function hasPermission(userId, requiredRole) {
  const user = users.get(userId);
  if (!user) return false;

  const userLevel = ROLE_HIERARCHY.indexOf(user.role);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  return userLevel >= requiredLevel;
}

// ─────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

function getMembershipInfo(level) {
  return MEMBERSHIP_LEVELS[level] || MEMBERSHIP_LEVELS.free;
}

// ─────────────────────────────────────────────
// 导出
// ─────────────────────────────────────────────

module.exports = {
  register,
  login,
  getUser,
  getUserByEmail,
  updateUser,
  updateMembership,
  updateRole,
  deleteUser,
  listUsers,
  hasPermission,
  validateToken,
  destroySession,
  createVerifyCode,
  verifyCode,
  createWechatSession,
  bindWechatSession,
  getWechatSession,
  cleanupWechatSessions,
  MEMBERSHIP_LEVELS,
  ROLES,
  ROLE_HIERARCHY,
  getMembershipInfo,
};
