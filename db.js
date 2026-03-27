// db.js — Supabase 数据库操作层
// 封装所有数据库操作，Agent直接调用

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ─── 初始化 Supabase 客户端 ───────────────────
const supabase = createClient(
  process.env.SUPABASE_URL     || '',
  process.env.SUPABASE_SERVICE_KEY || '',  // 用 service_role key，有完整权限
);

const DB_ENABLED = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

if (!DB_ENABLED) {
  console.warn('[DB] ⚠️  未配置 Supabase，数据库功能降级为内存模式');
}

// ─────────────────────────────────────────────
// 客户操作
// ─────────────────────────────────────────────

/** 通过手机号或微信ID查找/创建客户 */
async function findOrCreateCustomer({ name, phone, wechat_id }) {
  if (!DB_ENABLED) return { id: 'local-' + Date.now(), name, phone, wechat_id };

  // 先查找
  const query = phone
    ? supabase.from('customers').select('*').eq('phone', phone).single()
    : supabase.from('customers').select('*').eq('wechat_id', wechat_id).single();

  const { data: existing } = await query;
  if (existing) return existing;

  // 新建
  const { data, error } = await supabase
    .from('customers')
    .insert([{ name, phone, wechat_id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** 更新客户信息 */
async function updateCustomer(id, updates) {
  if (!DB_ENABLED) return updates;
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** 获取客户完整档案（含记忆） */
async function getCustomerProfile(customerId) {
  if (!DB_ENABLED) return null;

  const [{ data: customer }, { data: memories }, { data: orders }] = await Promise.all([
    supabase.from('customers').select('*').eq('id', customerId).single(),
    supabase.from('customer_memories').select('*').eq('customer_id', customerId).order('importance', { ascending: false }).limit(20),
    supabase.from('orders').select('*').eq('customer_id', customerId).order('created_at', { ascending: false }).limit(5),
  ]);

  return { customer, memories: memories || [], recentOrders: orders || [] };
}

// ─────────────────────────────────────────────
// 记忆操作（小心专用）
// ─────────────────────────────────────────────

/** 保存一条客户记忆 */
async function saveMemory({ customer_id, memory_type, content, happened_at, importance = 3 }) {
  if (!DB_ENABLED) return { id: 'local-mem-' + Date.now() };

  const { data, error } = await supabase
    .from('customer_memories')
    .insert([{ customer_id, memory_type, content, happened_at, importance }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** 获取客户的所有记忆（按重要程度排序） */
async function getMemories(customerId, limit = 10) {
  if (!DB_ENABLED) return [];

  const { data, error } = await supabase
    .from('customer_memories')
    .select('*')
    .eq('customer_id', customerId)
    .order('importance', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ─────────────────────────────────────────────
// 会话操作
// ─────────────────────────────────────────────

/** 创建新会话 */
async function createSession({ customer_id, agent }) {
  if (!DB_ENABLED) return { id: 'local-sess-' + Date.now(), customer_id, agent, messages: [] };

  const { data, error } = await supabase
    .from('sessions')
    .insert([{ customer_id, agent, messages: [] }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** 追加消息到会话 */
async function appendMessage(sessionId, message) {
  if (!DB_ENABLED) return;

  // 先取出现有消息
  const { data: session } = await supabase
    .from('sessions')
    .select('messages')
    .eq('id', sessionId)
    .single();

  const messages = [...(session?.messages || []), { ...message, timestamp: new Date().toISOString() }];

  await supabase
    .from('sessions')
    .update({ messages })
    .eq('id', sessionId);
}

// ─────────────────────────────────────────────
// 订单操作
// ─────────────────────────────────────────────

/** 创建订单 */
async function createOrder({ customer_id, destination, departure_date, pax_count, pax_detail }) {
  if (!DB_ENABLED) return { id: 'local-order-' + Date.now() };

  // 生成订单号
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const order_no = `OC${date}${rand}`;

  const { data, error } = await supabase
    .from('orders')
    .insert([{ customer_id, order_no, destination, departure_date, pax_count, pax_detail }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** 更新订单状态 */
async function updateOrderStatus(orderId, status) {
  if (!DB_ENABLED) return;
  await supabase.from('orders').update({ status }).eq('id', orderId);
}

// ─────────────────────────────────────────────
// 运营统计（小绿用）
// ─────────────────────────────────────────────

/** 获取今日运营概览 */
async function getDailyStats() {
  if (!DB_ENABLED) return { inquiries: 0, confirmed: 0, departed: 0, total_customers: 0 };

  const today = new Date().toISOString().slice(0, 10);

  const [{ count: inquiries }, { count: confirmed }, { count: total_customers }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('customers').select('*', { count: 'exact', head: true }),
  ]);

  return { inquiries, confirmed, total_customers };
}

module.exports = {
  supabase,
  DB_ENABLED,
  // 客户
  findOrCreateCustomer,
  updateCustomer,
  getCustomerProfile,
  // 记忆
  saveMemory,
  getMemories,
  // 会话
  createSession,
  appendMessage,
  // 订单
  createOrder,
  updateOrderStatus,
  // 统计
  getDailyStats,
};
