# 🦞 旅业云 OpenClaw · 全栈开发路线图 v2.0

> 生成时间：2026-03-28
> 项目：OpenClaw 智途AI / 旅业云
> 仓库：https://github.com/Juben-geng/lvyeyun

---

## 📋 四大开发模块

### 模块 1：用户系统 + 后台管理
### 模块 2：前端 CMS 内容管理
### 模块 3：全栈功能测试 + AI 真实测试
### 模块 4：Nexu 融合 + 旅游品牌定制

---

## 模块 1：用户系统 + 后台管理

### 1.1 技术方案

```
用户系统架构：

微信扫码登录 ──→ 公众号OAuth ──→ 自动注册/登录
                                    ↓
邮箱注册登录 ──→ 邮箱验证 ──────→ 账号绑定
                                    ↓
                              ┌─────┴─────┐
                           个人用户    企业用户
                              │         │
                         基础功能    高级功能
                         免费版      付费版
```

### 1.2 数据库设计（新增表）

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  wechat_openid TEXT UNIQUE,
  wechat_unionid TEXT,
  nickname TEXT,
  avatar TEXT,
  password_hash TEXT,
  role TEXT DEFAULT 'user', -- user | enterprise | admin
  membership TEXT DEFAULT 'free', -- free | basic | pro | enterprise
  membership_expire_at TIMESTAMPTZ,
  company_name TEXT,
  company_license TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 会员套餐表
CREATE TABLE membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT, -- 免费版/基础版/专业版/企业版
  price DECIMAL(10,2),
  max_agents INTEGER DEFAULT 1,
  max_ai_calls_per_month INTEGER DEFAULT 100,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 导航管理表
CREATE TABLE navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  label TEXT NOT NULL,
  url TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 页面内容表
CREATE TABLE page_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL, -- index/features/about/contact
  section_key TEXT NOT NULL, -- hero/features_grid/pricing
  content JSONB NOT NULL, -- 灵活的内容结构
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.3 API 接口设计

```
POST /api/auth/register        # 邮箱注册
POST /api/auth/login           # 邮箱登录
POST /api/auth/wechat          # 微信扫码登录
GET  /api/auth/me              # 获取当前用户信息
PUT  /api/auth/profile         # 更新个人资料
POST /api/auth/enterprise      # 申请企业认证

GET  /api/admin/users          # 管理员：用户列表
PUT  /api/admin/users/:id      # 管理员：修改用户
PUT  /api/admin/users/:id/role # 管理员：修改权限

GET  /api/membership/plans     # 会员套餐列表
POST /api/membership/subscribe # 订阅会员
```

### 1.4 权限设计

| 角色 | 功能权限 |
|------|---------|
| **访客** | 查看首页、功能介绍 |
| **免费用户** | 3个Agent、100次AI调用/月 |
| **基础版** | 6个Agent、1000次AI调用/月 |
| **专业版** | 7个Agent、无限AI调用、CRM功能 |
| **企业版** | 全部功能 + API接入 + 多员工 |
| **管理员** | 后台管理 + 用户管理 + 数据统计 |

---

## 模块 2：前端 CMS 内容管理

### 2.1 页面板块管理

```
网站结构：

├── 首页 (index.html)
│   ├── Hero 大图区 → 标题/副标题/CTA按钮
│   ├── 三大痛点区 → 图标/标题/描述
│   ├── 效率对比区 → 对比表格
│   └── 客户评价区 → 评价卡片
│
├── 功能页 (features.html)
│   ├── 三大场景区 → 场景卡片
│   ├── 七大Agent区 → Agent介绍
│   └── 七层AI能力矩阵 → 技能展示
│
├── 价格页 (pricing.html) 🆕
│   ├── 会员套餐对比
│   └── FAQ 常见问题
│
├── 登录/注册页 (auth.html) 🆕
│   ├── 邮箱登录/注册
│   ├── 微信扫码登录
│   └── 忘记密码
│
└── 后台管理 (admin.html) 🆕
    ├── 仪表盘（数据概览）
    ├── 内容管理（页面编辑）
    ├── 导航管理（标签+链接）
    ├── 用户管理（列表+权限）
    └── 系统设置（会员/配置）
```

### 2.2 导航管理功能

```
导航栏结构：

[Logo]  [首页] [功能] [价格] [关于我们] [联系我们]  [登录/注册]

后台可编辑：
✅ 新增导航项（标签名 + 链接）
✅ 编辑导航项（修改标签/链接/图标）
✅ 删除导航项
✅ 排序（拖拽排序）
✅ 显示/隐藏
```

### 2.3 CMS 编辑器

每个板块支持：
- **富文本编辑**：标题、描述、正文
- **图片管理**：上传/替换/裁剪
- **样式调整**：颜色、字号、间距
- **实时预览**：编辑即所见

---

## 模块 3：全栈功能测试

### 3.1 测试清单

#### API 接口测试
| 接口 | 方法 | 测试内容 | 状态 |
|------|------|---------|------|
| `/status` | GET | 健康检查 | ⏳ |
| `/agents` | GET | Agent列表 | ⏳ |
| `/chat` | POST | 龙虾路由 | ⏳ |
| `/agent/xiaolan` | POST | 小旧行程规划 | ⏳ |
| `/agent/xiaocheng` | POST | 小橙需求采集 | ⏳ |
| `/agent/xiaojin` | POST | 小金比价报价 | ⏳ |
| `/agent/xiaonuan` | POST | 小暖售后管家 | ⏳ |
| `/agent/xiaoxin` | POST | 小心情感伴侣 | ⏳ |
| `/agent/xiaolv` | POST | 小绿运营官 | ⏳ |

#### AI 功能测试
| 测试场景 | 输入 | 预期输出 | 状态 |
|---------|------|---------|------|
| 行程规划 | "规划3天西安行程" | 详细行程方案 | ⏳ |
| 需求采集 | "我要订个旅游" | 追问需求细节 | ⏳ |
| 比价报价 | "云南5天，预算8000" | 3档报价单 | ⏳ |
| 售后提醒 | "明天出发去云南" | 出行前检查清单 | ⏳ |
| 生日祝福 | "王阿姨今天生日" | 走心祝福 | ⏳ |
| 运营汇总 | "出今日运营日报" | 数据报表 | ⏳ |
| 龙虾路由 | "我想带父母去西藏" | 自动分发到小蓝 | ⏳ |

#### 前端页面测试
| 页面 | 测试内容 | 状态 |
|------|---------|------|
| 首页 | 加载速度、响应式、动画 | ⏳ |
| 功能页 | Agent展示、交互 | ⏳ |
| 登录页 | 表单验证、OAuth跳转 | ⏳ |
| 后台 | 权限控制、数据展示 | ⏳ |

---

## 模块 4：Nexu 融合 + 旅游品牌定制

### 4.1 Nexu 项目信息

- **仓库**：https://github.com/nexu-io/nexu
- **技术栈**：Electron + TypeScript + React
- **许可**：MIT（可自由修改）
- **版本**：v0.1.7（活跃维护中）

### 4.2 定制方案

```
Nexu 原版：
  🦞 OpenClaw → 通用 Agent 客户端

旅业云定制版（TripClaw）：
  🦞 智途AI → 旅游行业专属 Agent 客户端
```

### 4.3 品牌定制内容

| 定制项 | 原版 | 定制版 |
|--------|------|--------|
| **名称** | Nexu | 智途AI (TripClaw) |
| **Logo** | 龙虾图标 | 🦞 旅业龙虾（定制设计） |
| **主色** | 紫色 | 海蓝色 + 橙色 |
| **定位** | 通用Agent | 旅游行业AI |
| **默认模型** | Claude | 支持多种模型 |
| **默认技能** | 通用技能 | 旅游行业技能 |
| **连接平台** | 微信/飞书/Slack/Discord | 微信/飞书 + 旅业API |

### 4.4 融合架构

```
定制版 Nexu (TripClaw Desktop)
  │
  ├── 🦞 智途AI 品牌主题
  │     ├── Logo（旅业龙虾）
  │     ├── 配色方案（海蓝+橙）
  │     └── 欢迎页（旅游场景）
  │
  ├── 🔌 渠道连接
  │     ├── 微信（公众号 + 个人号）
  │     ├── 飞书（企业通讯）
  │     └── Web（在线客服）
  │
  ├── 🤖 Agent 面板
  │     ├── 七大Agent状态监控
  │     ├── 实时对话监控
  │     └── 技能管理面板
  │
  └── 📊 运营数据
        ├── 客户数据看板
        ├── 订单转化分析
        └── AI 调用量统计
```

### 4.5 定制步骤

```bash
# 1. Fork 并克隆 Nexu
git clone https://github.com/nexu-io/nexu.git
cd nexu

# 2. 修改品牌配置
# - apps/desktop/src/config/brand.ts → 修改名称、Logo、颜色
# - apps/web/src/pages/Landing.tsx → 修改首页内容
# - packages/shared/constants.ts → 修改默认配置

# 3. 添加旅游行业技能
# - skills/travel-planner.md
# - skills/crm-automation.md
# - skills/customer-success.md

# 4. 构建定制版
pnpm install
pnpm run build

# 5. 打包成安装程序
# - Windows: .exe
# - macOS: .dmg
# - Linux: .AppImage
```

---

## 📅 开发排期

### Phase 1：基础设施（第1周）
- [ ] Supabase 建表（用户/会员/导航/内容）
- [ ] 用户注册/登录 API
- [ ] 微信 OAuth 接入
- [ ] JWT 鉴权中间件

### Phase 2：前端开发（第2周）
- [ ] 登录/注册页面
- [ ] 后台管理页面（CMS）
- [ ] 导航管理功能
- [ ] 内容编辑功能

### Phase 3：全栈测试（第3周）
- [ ] API 接口自动化测试
- [ ] 7个Agent AI 真实测试
- [ ] 前端页面兼容性测试
- [ ] 性能优化

### Phase 4：Nexu 定制（第4周）
- [ ] Fork Nexu 仓库
- [ ] 品牌主题定制
- [ ] 旅游技能集成
- [ ] 桌面端打包测试

---

## 🎯 需要你确认

1. **技术框架**：前端用纯 HTML/CSS/JS 还是 React/Vue？
2. **数据库**：继续用 Supabase 还是换其他方案？
3. **微信接入**：是否已有微信公众号（服务号）？
4. **Nexu 定制**：先改品牌外观，还是先做深度功能集成？
5. **开发优先级**：4个模块先做哪个？

---

**生成时间**：2026-03-28 15:51
**文档版本**：v2.0
**维护者**：智途AI团队 🦞
