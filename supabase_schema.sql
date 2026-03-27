-- 月令灵境 AI 旅游 SaaS - Supabase 数据库建表脚本
-- 执行时间：2026-03-27

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建客户档案表
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100),
  phone VARCHAR(20),
  wechat VARCHAR(100),
  email VARCHAR(100),
  preferences TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建会话记录表
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  session_id VARCHAR(100),
  agent_type VARCHAR(50),
  messages JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  order_number VARCHAR(50),
  destination VARCHAR(100),
  days INTEGER,
  adults INTEGER,
  children INTEGER,
  price DECIMAL(10,2),
  status VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建行程方案表
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  title VARCHAR(200),
  content TEXT,
  days JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建供应商表
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100),
  type VARCHAR(50),
  contact VARCHAR(100),
  price_range VARCHAR(50),
  notes TEXT
);

-- 创建运营日报表
CREATE TABLE IF NOT EXISTS daily_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE,
  total_customers INTEGER,
  total_orders INTEGER,
  total_revenue DECIMAL(10,2),
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_wechat ON customers(wechat);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_customer ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_itineraries_order ON itineraries(order_id);

-- 插入示例数据（可选）
INSERT INTO suppliers (name, type, contact, price_range, notes) VALUES
('大理云朵旅行社', '地接社', '张经理 13800138000', '中等', '合作5年，服务好'),
('丽江古城客栈联盟', '住宿', '李老板 13900139000', '中低', '古城区多家客栈'),
('香格里拉户外俱乐部', '活动', '王教练 13700137000', '中高', '专业户外团队')
ON CONFLICT DO NOTHING;

-- 完成
SELECT '✅ 数据库建表完成！' as status;
