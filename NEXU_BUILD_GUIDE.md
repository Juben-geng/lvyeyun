# 📦 Nexu 自定义打包完整指南

## 🎯 你关心的问题

**问：改了 Logo 和功能后，是不是还得给用户装 Node.js？**

**答：不需要！** 打包后的 `.exe` 安装包已经包含所有依赖，用户双击安装即可。

---

## 📋 完整流程对比

| 环节 | 官方版下载 | 自定义版（你的情况） |
|------|-----------|---------------------|
| **你的操作** | 直接下载 `.exe` | 构建 `.exe`（一次性） |
| **用户操作** | 双击安装 → 完成 | 双击安装 → 完成 |
| **用户需要 Node.js?** | ❌ 不需要 | ❌ 不需要 |
| **用户需要技术背景?** | ❌ 不需要 | ❌ 不需要 |
| **打包内容** | Nexu 官方品牌 | **你的品牌 + 你的配置** |

---

## 🛠️ 自定义打包步骤（一次性工作）

### 第1步：Fork 并克隆仓库

```bash
# 1. Fork 到自己的 GitHub
# 2. 克隆到本地
git clone https://github.com/Juben-geng/nexu.git
cd nexu
```

---

### 第2步：安装依赖

```bash
# 确保 Node.js 22+ 和 pnpm 10+
node --version
pnpm --version

# 安装依赖
pnpm install
```

---

### 第3步：修改品牌（可选但推荐）

#### A. 修改应用名称

```javascript
// apps/desktop/package.json
{
  "name": "lvyeyun-ai",           // 改成你的名字
  "productName": "旅业云AI · TripClaw",  // 显示名称
  "description": "旅行社智能运营平台"
}
```

#### B. 替换 Logo

```
准备你的 Logo 图片：
- Windows: icon.ico (256x256)
- Mac: icon.icns

替换位置：
apps/desktop/assets/icon.ico  → 换成你的 logo.ico
apps/desktop/assets/icon.icns  → 换成你的 logo.icns
```

#### C. 配置默认 API 地址（预配置）

```javascript
// apps/desktop/src/config/api.js
export const DEFAULT_API_CONFIG = {
  baseURL: 'https://lvyeyun.vercel.app',  // 你的 TripClaw API
  endpoint: '/chat'
};
```

这样用户安装后**不需要手动配置 API 地址**，直接就能用！

---

### 第4步：构建 Windows 安装包

```bash
# 进入桌面应用目录
cd apps/desktop

# 构建 Windows 版（.exe 安装包）
pnpm run build:win

# 或者使用 electron-builder 直接打包
npx electron-builder --win --x64
```

**构建产物位置：**
```
apps/desktop/dist/
  └── LvyeyunAI-Setup-1.0.0.exe  ← 这就是你要发给用户的安装包！
```

---

### 第5步：测试安装包

```bash
# 自己先测试一下安装流程
cd apps/desktop/dist

# 双击 LvyeyunAI-Setup-1.0.0.exe
# 安装 → 打开 → 测试功能
```

---

## 🚀 分发给用户（超级简单）

### 用户收到的内容

```
📦 LvyeyunAI-Setup-1.0.0.exe  (约 150-200MB)

包含内容：
✅ Node.js 运行时（内置）
✅ Electron 框架
✅ 你的 Logo 和品牌
✅ 预配置的 API 地址
✅ 七大 Agent 连接
✅ 微信/飞书接入功能
```

### 用户安装流程（3步）

```
第1步：双击 LvyeyunAI-Setup-1.0.0.exe
        ↓
第2步：点击 "下一步" → "下一步" → "完成"
        ↓
第3步：打开应用 → 扫码接入微信/飞书
        ↓
完成！旅行社 AI 客服立即工作
```

**完全不需要：**
- ❌ 安装 Node.js
- ❌ 运行 npm 命令
- ❌ 配置 API 地址（已预配置）
- ❌ 任何技术背景

---

## 🎨 进阶定制（可选）

### A. 修改应用图标

```
准备 3 个尺寸的图标：
- 16x16.png   (任务栏小图标)
- 32x32.png   (任务栏正常图标)
- 256x256.png (安装向导大图标)

使用工具转换：
icon.ico  (Windows)
icon.icns  (Mac)
```

### B. 修改安装向导文案

```javascript
// electron-builder 配置
{
  "win": {
    "installerIcon": "assets/icon.ico",
    "uninstallerIcon": "assets/icon.ico",
    "installerHeaderIcon": "assets/icon.ico",
    "loadingGif": "assets/install.gif"
  }
}
```

### C. 预装 Skills（可选）

```javascript
// 在构建时把 Skills 打包进去
{
  "extraResources": [
    {
      "from": "skills/",
      "to": "skills/"
    }
  ]
}
```

这样用户安装后**不需要手动安装 Skills**。

---

## 📊 构建配置完整示例

```javascript
// apps/desktop/package.json
{
  "name": "lvyeyun-ai",
  "productName": "旅业云AI · TripClaw",
  "version": "1.0.0",
  "description": "旅行社智能运营平台",
  
  "build": {
    "appId": "com.lvyeyun.ai",
    "productName": "旅业云AI",
    
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ],
      "icon": "assets/icon.ico",
      "artifactName": "${productName}-Setup-${version}.${ext}"
    },
    
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "installerIcon": "assets/icon.ico",
      "uninstallerIcon": "assets/icon.ico",
      "installerHeaderIcon": "assets/icon.ico",
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    },
    
    "files": [
      "**/*",
      "!**/*.map"
    ]
  }
}
```

---

## ⚡ 快速开始命令

```bash
# 一键克隆、安装依赖、构建
git clone https://github.com/Juben-geng/nexu.git
cd nexu
pnpm install
pnpm run build:win

# 找到安装包
cd apps/desktop/dist
ls *.exe
```

---

## 💡 常见问题

### Q1: 构建需要多久？
**A:** 第一次构建约 10-15 分钟，后续增量构建 2-3 分钟。

### Q2: 构建失败怎么办？
**A:** 检查 Node.js 版本（需要 22+）和 pnpm 版本（需要 10+）。

### Q3: 能给 Mac 用户用吗？
**A:** 可以，运行 `pnpm run build:mac` 生成 `.dmg` 安装包。

### Q4: 安装包能有多小？
**A:** 约 150-200MB（包含 Node.js + Electron + 所有依赖）。

### Q5: 用户能自己卸载吗？
**A:** 可以，Windows 会自动生成卸载程序（"旅业云AI"在"程序和功能"中）。

---

## 🎯 最终建议

### 方案A：先用官方版验证（推荐）
```
下载官方 Nexu → 配置 TripClaw API → 测试流程
```

### 方案B：验证通过后再自建品牌版
```
Fork Nexu → 改 Logo/名称 → 预配置 API → 构建 .exe
```

---

## 📦 交付清单

当你准备好发给客户时：

```
✅ LvyeyunAI-Setup-1.0.0.exe
✅ 简单使用说明.md（可选）
✅ 微信接入演示视频（可选）
```

用户只需要**一个文件**，双击安装即可使用！
