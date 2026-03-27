# 🗄️ Supabase 数据库配置指南

## 📋 步骤1：创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 点击 **Start your project**
3. 登录或注册账号
4. 点击 **New project**
5. 填写项目信息：
   - **Name**: `openclaw-ai`（或你喜欢的名字）
   - **Database Password**: 设置强密码并保存
   - **Region**: 选择最接近的区域（如：Southeast Asia (Singapore)）
6. 点击 **Create new project**
7. 等待2-3分钟项目创建完成

---

## 🗄️ 步骤2：执行建表 SQL

1. 在 Supabase 项目左侧菜单点击 **SQL Editor**
2. 点击 **New query**
3. 复制 `supabase_schema.sql` 文件的全部内容
4. 粘贴到 SQL Editor
5. 点击 **Run** 或按 `Ctrl+Enter`
6. 看到提示 `✅ OpenClaw 数据库建表完成！` 即成功

---

## 🔑 步骤3：获取 API 凭证

1. 在左侧菜单点击 **Project Settings** → **API**
2. 复制以下信息：

### Project URL
```
https://xxxxxxxxxxxx.supabase.co
```

### service_role key（重要！）
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意**：
- 复制 `service_role` key（不是 `anon` key）
- 这个密钥有完整数据库权限，请妥善保管
- 不要泄露给前端或第三方

---

## 🔒 步骤4：配置安全策略（可选）

生产环境建议修改 RLS 策略：

```sql
-- 在 SQL Editor 中执行以下安全策略

-- 删除开发阶段的开放策略
drop policy "service role full access" on customers;
drop policy "service role full access" on customer_memories;
drop policy "service role full access" on sessions;
drop policy "service role full access" on orders;
drop policy "service role full access" on itineraries;
drop policy "service role full access" on quotes;

-- 创建基于角色的策略
create policy "authenticated users can read customers"
  on customers for select
  using (auth.role() = 'authenticated');

create policy "authenticated users can insert customers"
  on customers for insert
  with check (auth.role() = 'authenticated');

-- 为其他表创建类似策略...
```

---

## 🧪 步骤5：测试数据库连接

### 使用 Supabase Dashboard 测试

1. 点击 **Table Editor**
2. 查看创建的6张表：
   - ✅ customers
   - ✅ customer_memories
   - ✅ sessions
   - ✅ orders
   - ✅ itineraries
   - ✅ quotes

### 使用 API 测试

```bash
# 使用 curl 测试
curl -X GET 'https://your-project.supabase.co/rest/v1/customers' \
  -H 'apikey: your-service-role-key' \
  -H 'Authorization: Bearer your-service-role-key'
```

---

## 📊 数据库表结构说明

### customers（客户表）
- 存储客户基本信息
- 包含旅行次数、消费金额等统计
- 支持标签和备注

### customer_memories（客户记忆表）
- 小心（情感伴侣）专用
- 记录旅行故事、偏好、情感节点
- 支持向量搜索（语义检索）

### sessions（会话表）
- 存储与七大Agent的对话历史
- 支持多客户并发会话

### orders（订单表）
- 完整的订单生命周期管理
- 从询价到完成的全状态跟踪

### itineraries（行程方案表）
- 小蓝（行程规划）生成的方案
- 支持多版本管理和确认

### quotes（报价单表）
- 小金（比价报价）生成的报价
- 包含成本、售价、利润率

---

## 🚀 下一步：配置 Vercel

获取到 Supabase 凭证后，在 Vercel 中配置环境变量：

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💡 常见问题

### Q1: 忘记密码怎么办？
**A**: Supabase 无法查看密码，但可以在项目设置中重置数据库密码。

### Q2: 需要升级付费吗？
**A**: 免费版额度：500MB 数据库，1GB 文件存储，2GB 带宽/月，个人项目够用。

### Q3: 可以导出数据吗？
**A**: 可以！在 Database → Backups 中可以随时导出 SQL 文件。

### Q4: 数据会丢失吗？
**A**: Supabase 自动备份（免费版7天），生产环境建议定期导出备份。

---

**配置完成后，就可以完整部署到 Vercel 了！** 🚀
