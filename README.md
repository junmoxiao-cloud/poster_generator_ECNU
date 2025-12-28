# 校园海报生成器

一键生成社团风海报，支持多平台宣发文案。

## 功能特性

- 🎨 **一键生成海报** - 输入活动信息，自动生成社团风海报
- 📱 **多平台文案** - 自动生成朋友圈、小红书、一句话总结
- 📥 **PNG 导出** - 高清海报图片下载
- 🔗 **分享页面** - 专属链接便于分享传播
- 🏫 **ECNU 预设** - 支持华东师范大学地点快捷选择

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 环境变量

创建 `.env.local` 文件：

```env
# DeepSeek API Key（可选，用于AI文案生成）
DEEPSEEK_API_KEY=your-api-key

# OpenAI API Key（备选）
OPENAI_API_KEY=your-api-key
```

未配置 API Key 时，使用模板规则生成文案。

## 项目结构

```
├── app/
│   ├── api/               # API 路由
│   │   ├── posters/       # 海报 CRUD
│   │   └── copy-model/    # AI 文案生成
│   ├── p/[id]/            # 分享页
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/
│   ├── PosterForm.tsx     # 表单组件
│   ├── PosterPreview.tsx  # 预览组件
│   └── ui/                # 基础 UI 组件
├── lib/
│   ├── db.ts              # 数据存储
│   ├── generate-copies.ts # 文案生成
│   └── export-poster.ts   # 海报导出
└── public/                # 静态资源
```

## 部署方式

### Vercel（推荐）

1. 将项目推送到 GitHub
2. 在 Vercel 导入项目
3. 无需额外配置，自动部署

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 传统服务器

```bash
npm run build
npm start
```

## 技术栈

- **框架**: Next.js 14
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **数据库**: JSON 文件（本地）
- **海报生成**: html-to-image

## 使用说明

1. 填写活动信息（名称、时间、地点、主办方）
2. 开启"ECNU 角标"显示华东师范大学标识
3. 可选填写活动简介和报名链接
4. 点击"生成海报"创建并保存
5. 复制多平台文案或下载海报图片
6. 分享链接让更多人看到活动

## License

MIT
