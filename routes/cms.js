// routes/cms.js — 🦞 CMS 内容管理路由
// GET/POST/PUT/DELETE /api/cms/nav     — 导航管理
// GET/POST/PUT/DELETE /api/cms/sections — 板块管理
// GET/POST/PUT/DELETE /api/cms/pages   — 页面管理
// GET/PUT /api/cms/config              — 网站配置

const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const cms = require('../cms');

// ─────────────────────────────────────────────
// 导航管理
// ─────────────────────────────────────────────

// 获取导航（公开）
router.get('/nav', (req, res) => {
  res.json({ items: cms.getNavItems() });
});

// 获取所有导航（含隐藏，管理用）
router.get('/nav/all', requireAuth, requireRole('agent'), (req, res) => {
  res.json({ items: cms.getAllNavItems() });
});

// 添加导航
router.post('/nav', requireAuth, requireRole('agent'), (req, res) => {
  const { label, url, icon, sort, visible } = req.body;
  if (!label || !url) return res.status(400).json({ error: '标签和链接不能为空' });
  const item = cms.addNavItem({ label, url, icon, sort, visible });
  res.status(201).json({ item });
});

// 更新导航
router.put('/nav/:id', requireAuth, requireRole('agent'), (req, res) => {
  const item = cms.updateNavItem(req.params.id, req.body);
  if (!item) return res.status(404).json({ error: '导航项不存在' });
  res.json({ item });
});

// 删除导航
router.delete('/nav/:id', requireAuth, requireRole('agent'), (req, res) => {
  const deleted = cms.deleteNavItem(req.params.id);
  res.json({ ok: deleted });
});

// ─────────────────────────────────────────────
// 板块内容管理
// ─────────────────────────────────────────────

// 获取板块（公开）
router.get('/sections', (req, res) => {
  res.json({ sections: cms.getSections(req.query.page) });
});

// 获取单个板块
router.get('/sections/:id', (req, res) => {
  const section = cms.getSection(req.params.id);
  if (!section) return res.status(404).json({ error: '板块不存在' });
  res.json({ section });
});

// 添加板块
router.post('/sections', requireAuth, requireRole('agent'), (req, res) => {
  const { page, title, type, content, sort } = req.body;
  if (!title) return res.status(400).json({ error: '标题不能为空' });
  const section = cms.addSection({ page, title, type, content, sort });
  res.status(201).json({ section });
});

// 更新板块
router.put('/sections/:id', requireAuth, requireRole('agent'), (req, res) => {
  const section = cms.updateSection(req.params.id, req.body);
  if (!section) return res.status(404).json({ error: '板块不存在' });
  res.json({ section });
});

// 删除板块
router.delete('/sections/:id', requireAuth, requireRole('agent'), (req, res) => {
  const deleted = cms.deleteSection(req.params.id);
  res.json({ ok: deleted });
});

// ─────────────────────────────────────────────
// 页面管理
// ─────────────────────────────────────────────

// 获取所有页面（公开）
router.get('/pages', (req, res) => {
  res.json({ pages: cms.getPages() });
});

// 添加页面
router.post('/pages', requireAuth, requireRole('admin'), (req, res) => {
  const { title, slug, template, status } = req.body;
  if (!title) return res.status(400).json({ error: '标题不能为空' });
  const page = cms.addPage({ title, slug, template, status });
  res.status(201).json({ page });
});

// 更新页面
router.put('/pages/:id', requireAuth, requireRole('admin'), (req, res) => {
  const page = cms.updatePage(req.params.id, req.body);
  if (!page) return res.status(404).json({ error: '页面不存在' });
  res.json({ page });
});

// 删除页面
router.delete('/pages/:id', requireAuth, requireRole('admin'), (req, res) => {
  const deleted = cms.deletePage(req.params.id);
  res.json({ ok: deleted });
});

// ─────────────────────────────────────────────
// 网站配置
// ─────────────────────────────────────────────

// 获取配置（公开）
router.get('/config', (req, res) => {
  res.json({ config: cms.getSiteConfig() });
});

// 更新配置（管理员）
router.put('/config', requireAuth, requireRole('admin'), (req, res) => {
  const config = cms.updateSiteConfig(req.body);
  res.json({ config, message: '配置已更新' });
});

module.exports = router;
