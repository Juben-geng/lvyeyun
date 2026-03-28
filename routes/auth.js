// routes/auth.js — 🦞 用户认证路由
// POST /api/auth/register    — 邮箱注册
// POST /api/auth/login       — 邮箱登录
// POST /api/auth/verify-code — 验证邮箱验证码
// POST /api/auth/wechat-login — 微信小程序登录（wx.login code换token）
// POST /api/auth/wechat-mp   — 微信公众号扫码登录
// GET  /api/auth/profile     — 获取当前用户信息
// PUT  /api/auth/profile     — 更新个人信息
// POST /api/auth/logout      — 退出登录

const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const auth = require('../auth');

// ─────────────────────────────────────────────
// POST /api/auth/register — 邮箱注册
// ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, company } = req.body;
    if (!email || !password) return res.status(400).json({ error: '邮箱和密码不能为空' });
    if (password.length < 6) return res.status(400).json({ error: '密码至少6位' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: '邮箱格式不正确' });

    const result = await auth.register({ email, password, name, company });
    if (result.error) return res.status(409).json(result);

    const code = auth.createVerifyCode(email, result.user.id);
    res.status(201).json({
      message: '注册成功', user: result.user,
      verifyCode: code, token: auth.createSession(result.user.id),
    });
  } catch (err) {
    console.error('[Register Error]', err);
    res.status(500).json({ error: '注册失败' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/login — 邮箱登录
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: '邮箱和密码不能为空' });
    const result = await auth.login({ email, password });
    if (result.error) return res.status(401).json(result);
    res.json(result);
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ error: '登录失败' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/verify-code — 邮箱验证
// ─────────────────────────────────────────────
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: '邮箱和验证码不能为空' });
  const userId = auth.verifyCode(email, code);
  if (!userId) return res.status(400).json({ error: '验证码无效或已过期' });
  res.json({ message: '邮箱验证成功' });
});

// ─────────────────────────────────────────────
// POST /api/auth/wechat-login — 微信小程序登录
// Body: { code } (wx.login 获取的临时code)
// ─────────────────────────────────────────────
router.post('/wechat-login', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: '缺少微信登录code' });

    const appid = process.env.WECHAT_APPID;
    const secret = process.env.WECHAT_APPSECRET;

    // 演示模式：直接模拟
    if (!appid || !secret) {
      const demoUserId = 'wx-demo-' + code.slice(0, 8);
      let demoUser = auth.getUser(demoUserId);
      if (!demoUser) {
        const result = await auth.register({
          email: `wx_${code.slice(0, 8)}@demo.com`,
          password: 'wx_demo_' + Date.now(),
          name: '微信用户',
        });
        if (result.error) return res.status(400).json(result);
        demoUser = result.user;
      }
      return res.json({ token: auth.createSession(demoUser.id), user: demoUser, isNew: !demoUser.lastLogin, demo: true });
    }

    // 生产模式：调用微信 code2Session
    const https = require('https');
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    const wxResult = await new Promise((resolve, reject) => {
      https.get(url, resp => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    if (wxResult.errcode) return res.status(400).json({ error: '微信登录失败', detail: wxResult });
    const { openid } = wxResult;
    let user = auth.getUserByEmail(`wx_${openid}@lvyeyun.com`);
    if (!user) {
      const result = await auth.register({ email: `wx_${openid}@lvyeyun.com`, password: 'wx_' + Date.now(), name: '微信用户' });
      user = result.user;
    }
    res.json({ token: auth.createSession(user.id), user, isNew: false });
  } catch (err) {
    console.error('[WeChat Login Error]', err);
    res.status(500).json({ error: '微信登录失败' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/wechat-mp — 微信公众号扫码登录
// ─────────────────────────────────────────────
router.post('/wechat-mp', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: '缺少授权code' });

    const appid = process.env.WECHAT_MP_APPID;
    const secret = process.env.WECHAT_MP_APPSECRET;

    if (!appid || !secret) {
      return res.json({ demo: true, message: '需要在环境变量配置 WECHAT_MP_APPID + WECHAT_MP_APPSECRET' });
    }

    const https = require('https');
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;
    const wxResult = await new Promise((resolve, reject) => {
      https.get(url, resp => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    if (wxResult.errcode) return res.status(400).json({ error: '公众号授权失败', detail: wxResult });
    res.json({ message: '授权成功', openid: wxResult.openid });
  } catch (err) {
    console.error('[WeChat MP Error]', err);
    res.status(500).json({ error: '公众号登录失败' });
  }
});

// ─────────────────────────────────────────────
// GET /api/auth/profile — 获取当前用户信息
// ─────────────────────────────────────────────
router.get('/profile', requireAuth, (req, res) => {
  const user = auth.getUser(req.userId);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ user });
});

// ─────────────────────────────────────────────
// PUT /api/auth/profile — 更新个人信息
// ─────────────────────────────────────────────
router.put('/profile', requireAuth, (req, res) => {
  const user = auth.updateUser(req.userId, req.body);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ user, message: '个人信息已更新' });
});

// ─────────────────────────────────────────────
// POST /api/auth/logout — 退出登录
// ─────────────────────────────────────────────
router.post('/logout', requireAuth, (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) auth.destroySession(token);
  res.json({ message: '已退出登录' });
});

// ─────────────────────────────────────────────
// 管理后台接口
// ─────────────────────────────────────────────
router.get('/admin/users', requireAuth, requireRole('admin'), (req, res) => {
  const { page, pageSize, role, membership, search } = req.query;
  res.json(auth.listUsers({ page, pageSize, role, membership, search }));
});

router.put('/admin/membership/:userId', requireAuth, requireRole('admin'), (req, res) => {
  const result = auth.updateMembership(req.params.userId, req.body.level, req.body.expiresAt);
  if (!result) return res.status(404).json({ error: '用户不存在' });
  if (result.error) return res.status(400).json(result);
  res.json({ user: result, message: '会员等级已更新' });
});

router.put('/admin/role/:userId', requireAuth, requireRole('superadmin'), (req, res) => {
  const result = auth.updateRole(req.params.userId, req.body.role);
  if (!result) return res.status(404).json({ error: '用户不存在' });
  if (result.error) return res.status(400).json(result);
  res.json({ user: result, message: '角色已更新' });
});

router.delete('/admin/users/:userId', requireAuth, requireRole('superadmin'), (req, res) => {
  const deleted = auth.deleteUser(req.params.userId);
  res.json({ ok: deleted, message: deleted ? '用户已删除' : '用户不存在' });
});

module.exports = router;
