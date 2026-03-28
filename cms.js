// cms.js — 🦞 前端内容管理系统 (CMS)
// 支持板块内容编辑 + 导航标签/链接增删改 + 网站配置

const { v4: uuidv4 } = require('uuid');

// ─────────────────────────────────────────────
// 内存数据存储（演示模式）
// ─────────────────────────────────────────────

// 导航菜单
const navItems = new Map();
// 初始化默认导航
const defaultNav = [
  { id: 'nav-home', label: '首页', url: '/', icon: '🏠', sort: 0, visible: true },
  { id: 'nav-agents', label: 'AI助手', url: '/agents', icon: '🤖', sort: 1, visible: true },
  { id: 'nav-itinerary', label: '行程规划', url: '/itinerary', icon: '🗺️', sort: 2, visible: true },
  { id: 'nav-pricing', label: '产品报价', url: '/pricing', icon: '💰', sort: 3, visible: true },
  { id: 'nav-about', label: '关于我们', url: '/about', icon: 'ℹ️', sort: 4, visible: true },
];
defaultNav.forEach(item => navItems.set(item.id, { ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));

// 页面板块内容
const sections = new Map();
// 初始化默认板块
const defaultSections = [
  {
    id: 'hero', page: 'home', title: '首页横幅', type: 'hero',
    content: { heading: '🦞 OpenClaw 智途AI', subheading: '七大Agent，让旅行更简单', cta: '开始体验', ctaUrl: '/chat', backgroundImage: '' },
  },
  {
    id: 'features', page: 'home', title: '核心功能', type: 'grid',
    content: {
      items: [
        { icon: '🍊', title: '需求采集', desc: '10分钟完整采集客户旅游需求' },
        { icon: '🗺️', title: '行程规划', desc: '3分钟生成专业行程方案' },
        { icon: '💰', title: '比价报价', desc: '智能对比供应商价格' },
        { icon: '🌟', title: '售后管家', desc: '全程贴心出行服务' },
        { icon: '❤️', title: '情感伴侣', desc: '记住客户的每个重要时刻' },
        { icon: '📋', title: '运营官', desc: '数据驱动运营决策' },
      ],
    },
  },
  {
    id: 'cta', page: 'home', title: '行动号召', type: 'banner',
    content: { heading: '准备好开始了吗？', subheading: '免费体验智能旅行服务', cta: '立即注册', ctaUrl: '/register' },
  },
];
defaultSections.forEach(item => sections.set(item.id, { ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));

// 网站全局配置
const siteConfig = {
  siteName: '智途AI · 旅业云',
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  primaryColor: '#e74c3c',
  secondaryColor: '#2c3e50',
  footer: '© 2026 智途AI · 旅业云 — 让旅行更简单',
  contactEmail: 'hello@lvyeyun.com',
  wechatQrCode: '',
  icp: '',
  description: '七大AI Agent，替代传统旅行顾问，让旅游定制更高效、更智能。',
  keywords: 'AI旅行,智能行程规划,旅游SaaS,旅行定制,AI客服',
};

// 页面列表
const pages = new Map();
const defaultPages = [
  { id: 'home', title: '首页', slug: '/', template: 'home', status: 'published' },
  { id: 'agents', title: 'AI助手', slug: '/agents', template: 'agents', status: 'published' },
  { id: 'itinerary', title: '行程规划', slug: '/itinerary', template: 'itinerary', status: 'published' },
  { id: 'pricing', title: '产品报价', slug: '/pricing', template: 'pricing', status: 'published' },
  { id: 'about', title: '关于我们', slug: '/about', template: 'about', status: 'draft' },
];
defaultPages.forEach(item => pages.set(item.id, { ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));

// ─────────────────────────────────────────────
// 导航管理
// ─────────────────────────────────────────────

function getNavItems() {
  return Array.from(navItems.values())
    .filter(item => item.visible)
    .sort((a, b) => a.sort - b.sort);
}

function getAllNavItems() {
  return Array.from(navItems.values()).sort((a, b) => a.sort - b.sort);
}

function addNavItem({ label, url, icon, sort, visible = true }) {
  const id = 'nav-' + uuidv4().slice(0, 8);
  const item = {
    id, label, url, icon: icon || '🔗',
    sort: sort ?? navItems.size,
    visible,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  navItems.set(id, item);
  return item;
}

function updateNavItem(id, updates) {
  const item = navItems.get(id);
  if (!item) return null;

  const allowed = ['label', 'url', 'icon', 'sort', 'visible'];
  for (const key of allowed) {
    if (updates[key] !== undefined) item[key] = updates[key];
  }
  item.updatedAt = new Date().toISOString();
  navItems.set(id, item);
  return item;
}

function deleteNavItem(id) {
  return navItems.delete(id);
}

// ─────────────────────────────────────────────
// 板块内容管理
// ─────────────────────────────────────────────

function getSections(page) {
  return Array.from(sections.values())
    .filter(s => !page || s.page === page)
    .sort((a, b) => a.sort - b.sort);
}

function getSection(id) {
  return sections.get(id) || null;
}

function addSection({ page, title, type, content, sort }) {
  const id = uuidv4().slice(0, 8);
  const section = {
    id, page: page || 'home', title, type: type || 'text',
    content: content || {},
    sort: sort ?? sections.size,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  sections.set(id, section);
  return section;
}

function updateSection(id, updates) {
  const section = sections.get(id);
  if (!section) return null;

  if (updates.title !== undefined) section.title = updates.title;
  if (updates.type !== undefined) section.type = updates.type;
  if (updates.content !== undefined) section.content = updates.content;
  if (updates.sort !== undefined) section.sort = updates.sort;
  if (updates.page !== undefined) section.page = updates.page;
  section.updatedAt = new Date().toISOString();
  sections.set(id, section);
  return section;
}

function deleteSection(id) {
  return sections.delete(id);
}

// ─────────────────────────────────────────────
// 页面管理
// ─────────────────────────────────────────────

function getPages() {
  return Array.from(pages.values());
}

function getPage(id) {
  return pages.get(id) || null;
}

function getPageBySlug(slug) {
  for (const [, page] of pages) {
    if (page.slug === slug) return page;
  }
  return null;
}

function addPage({ title, slug, template, status }) {
  const id = slug?.replace(/\//g, '') || uuidv4().slice(0, 8);
  const page = {
    id, title, slug: slug || '/' + id,
    template: template || 'default',
    status: status || 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  pages.set(id, page);
  return page;
}

function updatePage(id, updates) {
  const page = pages.get(id);
  if (!page) return null;

  const allowed = ['title', 'slug', 'template', 'status'];
  for (const key of allowed) {
    if (updates[key] !== undefined) page[key] = updates[key];
  }
  page.updatedAt = new Date().toISOString();
  pages.set(id, page);
  return page;
}

function deletePage(id) {
  return pages.delete(id);
}

// ─────────────────────────────────────────────
// 网站配置
// ─────────────────────────────────────────────

function getSiteConfig() {
  return { ...siteConfig };
}

function updateSiteConfig(updates) {
  const allowed = ['siteName', 'logo', 'favicon', 'primaryColor', 'secondaryColor', 'footer', 'contactEmail', 'wechatQrCode', 'icp', 'description', 'keywords'];
  for (const key of allowed) {
    if (updates[key] !== undefined) siteConfig[key] = updates[key];
  }
  return { ...siteConfig };
}

// ─────────────────────────────────────────────
// 导出
// ─────────────────────────────────────────────

module.exports = {
  // 导航
  getNavItems,
  getAllNavItems,
  addNavItem,
  updateNavItem,
  deleteNavItem,
  // 板块
  getSections,
  getSection,
  addSection,
  updateSection,
  deleteSection,
  // 页面
  getPages,
  getPage,
  getPageBySlug,
  addPage,
  updatePage,
  deletePage,
  // 配置
  getSiteConfig,
  updateSiteConfig,
};
