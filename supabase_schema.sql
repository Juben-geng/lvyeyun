-- ============================================
-- OpenClaw 智途AI · Supabase 数据库建表脚本
-- 复制全部内容到 Supabase SQL Editor 执行
-- ============================================

-- 启用向量扩展（小心的语义记忆）
create extension if not exists vector;

-- ─────────────────────────────────────────────
-- 1. 客户表（小心的记忆核心）
-- ─────────────────────────────────────────────
create table if not exists customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text unique,
  wechat_id   text unique,
  birthday    date,
  city        text,                        -- 出发城市
  notes       text,                        -- 特殊备注（不吃香菜/怕高/蜜月）
  tags        text[] default '{}',         -- 标签：['亲子','高端','回头客']
  travel_count int default 0,              -- 累计出行次数
  total_spend  numeric(10,2) default 0,    -- 累计消费金额
  last_travel_at timestamptz,              -- 最近一次出行时间
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─────────────────────────────────────────────
-- 2. 客户记忆表（小心专用：旅行故事+情感记录）
-- ─────────────────────────────────────────────
create table if not exists customer_memories (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid references customers(id) on delete cascade,
  memory_type  text not null,   -- 'travel_story'|'preference'|'family'|'emotion'|'milestone'
  content      text not null,   -- 记忆内容
  happened_at  date,            -- 发生时间
  importance   int default 3,   -- 重要程度 1-5
  embedding    vector(1536),    -- 语义向量（pgvector）
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────
-- 3. 会话表（多Agent对话历史）
-- ─────────────────────────────────────────────
create table if not exists sessions (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid references customers(id),
  agent        text not null,   -- 'xiaocheng'|'xiaolan'|'xiaojin'|'xiaonuan'|'xiaoxin'|'xiaolv'|'lobster'
  messages     jsonb default '[]',  -- [{role, content, timestamp}]
  status       text default 'active',  -- 'active'|'closed'
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ─────────────────────────────────────────────
-- 4. 订单表
-- ─────────────────────────────────────────────
create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid references customers(id),
  order_no      text unique not null,     -- 订单编号 OC20260327001
  destination   text not null,
  departure_date date,
  return_date   date,
  pax_count     int default 1,
  pax_detail    jsonb default '{}',       -- {adults:2, children:1, seniors:0}
  status        text default 'inquiry',   -- 'inquiry'|'quoted'|'confirmed'|'departed'|'completed'|'cancelled'
  cost_price    numeric(10,2),            -- 成本价
  sell_price    numeric(10,2),            -- 售价
  profit_rate   numeric(5,2),             -- 利润率%
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─────────────────────────────────────────────
-- 5. 行程方案表（小蓝生成的行程）
-- ─────────────────────────────────────────────
create table if not exists itineraries (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid references orders(id),
  customer_id  uuid references customers(id),
  title        text not null,
  days         int not null,
  content      jsonb not null,   -- 每天行程详情
  version      int default 1,
  is_confirmed boolean default false,
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────
-- 6. 报价单表（小金生成的报价）
-- ─────────────────────────────────────────────
create table if not exists quotes (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid references orders(id),
  items        jsonb not null,   -- [{name, cost, sell, supplier}]
  total_cost   numeric(10,2),
  total_sell   numeric(10,2),
  profit_rate  numeric(5,2),
  version      int default 1,
  status       text default 'draft',  -- 'draft'|'sent'|'accepted'|'rejected'
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────
-- 索引优化
-- ─────────────────────────────────────────────
create index if not exists idx_customers_phone    on customers(phone);
create index if not exists idx_customers_wechat   on customers(wechat_id);
create index if not exists idx_sessions_customer  on sessions(customer_id);
create index if not exists idx_sessions_agent     on sessions(agent);
create index if not exists idx_orders_customer    on orders(customer_id);
create index if not exists idx_orders_status      on orders(status);
create index if not exists idx_memories_customer  on customer_memories(customer_id);
create index if not exists idx_memories_type      on customer_memories(memory_type);

-- 向量相似搜索索引（小心用）
create index if not exists idx_memories_embedding
  on customer_memories using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ─────────────────────────────────────────────
-- 自动更新 updated_at
-- ─────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_customers_updated
  before update on customers
  for each row execute function update_updated_at();

create trigger trg_sessions_updated
  before update on sessions
  for each row execute function update_updated_at();

create trigger trg_orders_updated
  before update on orders
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
-- Row Level Security（生产环境开启）
-- ─────────────────────────────────────────────
alter table customers         enable row level security;
alter table customer_memories enable row level security;
alter table sessions          enable row level security;
alter table orders            enable row level security;
alter table itineraries       enable row level security;
alter table quotes            enable row level security;

-- 开发阶段：允许 service_role 全权访问（用 service key 调用时生效）
create policy "service role full access" on customers         for all using (true);
create policy "service role full access" on customer_memories for all using (true);
create policy "service role full access" on sessions          for all using (true);
create policy "service role full access" on orders            for all using (true);
create policy "service role full access" on itineraries       for all using (true);
create policy "service role full access" on quotes            for all using (true);

-- ─────────────────────────────────────────────
-- 完成提示
-- ─────────────────────────────────────────────
do $$ begin
  raise notice '✅ OpenClaw 数据库建表完成！6张表已就绪。';
end $$;
