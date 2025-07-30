# Resona 共鸣交换所

一个匿名情绪共鸣平台的后端服务，基于 Cloudflare Workers 和 D1 数据库构建。

## 项目简介

Resona 是一个匿名情绪共鸣平台。用户提交一句话，后端通过 NLP 模型识别情绪标签，从数据库中匹配相似语句，返回"回声"给用户，提供"有人懂"的陪伴感。无登录，匿名、纯净。

## 技术栈

- **运行时**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **缓存**: Cloudflare KV
- **AI 服务**: OpenAI GPT / Google Gemini
- **语言**: JavaScript (ES6+)

## 功能特性

- 🎭 **情绪识别**: 支持 50 种情绪标签识别
- 💬 **智能共鸣**: AI 生成或匹配相似情绪的回声
- 🔒 **匿名保护**: 基于设备 ID 的匿名用户系统
- ⭐ **收藏功能**: 用户可以收藏喜欢的回声
- 🚦 **频率限制**: 防止 API 滥用
- 🌐 **CORS 支持**: 支持跨域请求
- 🔧 **自定义 API**: 支持自定义 AI API 地址

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境

复制 `env.example` 到 `.env` 并填写配置：

```bash
# AI API 密钥（至少配置一个）
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

# 自定义 AI API 地址（可选，用于代理或自建服务）
OPENAI_API_URL=https://api.openai.com/v1
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta

# Cloudflare 配置
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

### 3. 创建数据库

```bash
# 创建 D1 数据库
npm run db:create

# 应用数据库迁移
npm run db:migrate
```

### 4. 本地开发

```bash
npm run dev
```

### 5. 部署

```bash
npm run deploy
```

## AI API 配置

### 支持的 AI 服务

1. **OpenAI GPT** - 默认地址：`https://api.openai.com/v1`
2. **Google Gemini** - 默认地址：`https://generativelanguage.googleapis.com/v1beta`

### 自定义 API 地址

您可以通过环境变量配置自定义 API 地址，适用于以下场景：

- **代理服务器**: 使用自己的代理服务
- **自建服务**: 部署自己的 AI 服务
- **区域优化**: 选择更近的服务器
- **企业部署**: 使用企业内部的 AI 服务


#### 兼容性要求

自定义 API 地址需要兼容以下接口：

**OpenAI 兼容接口**:
- `POST /chat/completions` - 聊天完成接口

**Gemini 兼容接口**:
- `POST /models/gemini-pro:generateContent` - 内容生成接口

### 优先级

AI 服务的使用优先级：
1. OpenAI (如果配置了 `OPENAI_API_KEY`)
2. Gemini (如果配置了 `GEMINI_API_KEY`)
3. 关键词匹配 (降级方案)



## 限制说明

- 每个设备每分钟最多提交 3 次
- 每个设备最多收藏 20 条回声
- 文本长度限制 200 字
- 分页查询每页最多 50 条

## 开发指南

### 项目结构

```
src/
├── handlers/          # API 处理器
├── middleware/        # 中间件
├── services/          # 业务服务
├── utils/             # 工具函数
└── index.js          # 主入口文件
```

### 添加新接口

1. 在 `src/handlers/` 创建处理器
2. 在 `src/index.js` 添加路由
3. 更新 API 文档

### 数据库迁移

```bash
# 创建新迁移
wrangler d1 migrations create resona-db migration_name

# 应用迁移
npm run db:migrate
```

## 部署配置

### Cloudflare Workers

1. 创建 Worker
2. 绑定 D1 数据库
3. 绑定 KV 命名空间
4. 设置环境变量

### 环境变量

```toml
[vars]
ENVIRONMENT = "production"
MAX_SUBMISSIONS_PER_MINUTE = "3"
MAX_COLLECTIONS_PER_USER = "20"
EMOTION_TAGS = "sad,lonely,happy,confused,relieved,angry,missing,yearning"
OPENAI_API_URL = "https://api.openai.com/v1"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta"
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。 