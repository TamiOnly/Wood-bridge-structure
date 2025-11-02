# 神奇木结构 - STEM桥梁学习平台

一个专为高中生设计的桥梁设计与承重学习APP，提供方案评估、实时问答和学习效果分析功能。

## 🌉 项目特色

- **学生登录系统**：简单易用的身份验证
- **桥梁方案评估**：智能分析设计可行性
- **实时交互问答**：AI助手解答学习问题
- **学习效果评估**：前后对比分析学习进步
- **现代化UI**：美观直观的用户界面

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📱 功能模块

### 1. 学生登录
- 姓名、班级、学号验证
- 本地存储用户信息
- 自动登录状态管理

### 2. 桥梁设计评估
- **设计参数输入**：桥梁类型、材料、尺寸等
- **智能评估算法**：基于结构力学原理的可行性分析
- **评分系统**：多维度评估设计质量
- **设计管理**：保存、编辑、查看历史设计

### 3. 智能问答系统
- **实时对话**：AI助手解答学习问题
- **快速提问**：预设常见问题模板
- **专业知识**：桥梁工程、结构力学、材料科学
- **学习指导**：个性化学习建议

### 4. 学习效果评估
- **图片上传**：课程前后作品对比
- **智能分析**：AI评估学习进步
- **进步评分**：量化学习效果
- **学习建议**：个性化改进建议

## 🛠️ 技术栈

- **前端框架**：Next.js 14 + React 18
- **样式系统**：Tailwind CSS
- **状态管理**：Zustand
- **图标库**：Lucide React
- **动画效果**：Framer Motion
- **文件上传**：React Dropzone
- **通知系统**：React Hot Toast

## 📁 项目结构

```
APP/
├── app/                    # Next.js App Router
│   ├── api/                # API 路由
│   │   └── chat/           # 智能问答 API
│   ├── dashboard/          # 仪表板页面
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/             # React 组件
│   ├── LoginForm.tsx       # 登录表单
│   ├── MainDashboard.tsx   # 主仪表板
│   ├── BridgeDesigner.tsx  # 桥梁设计器
│   ├── ChatInterface.tsx   # 聊天界面
│   └── LearningProgress.tsx # 学习进度
├── lib/                    # 工具库
│   └── store.ts            # 状态管理
├── public/                 # 静态资源
├── package.json            # 项目配置
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 项目说明
```

## 🎯 使用指南

### 学生使用流程

1. **登录系统**
   - 输入姓名、班级、学号
   - 点击"开始学习"进入主界面

2. **桥梁设计**
   - 选择"桥梁设计"标签
   - 填写设计参数（名称、类型、材料、尺寸）
   - 系统自动评估可行性
   - 查看评分和改进建议

3. **智能问答**
   - 选择"智能问答"标签
   - 使用快速提问或直接输入问题
   - 获得专业解答和学习建议

4. **学习评估**
   - 选择"学习评估"标签
   - 上传课程前作品照片
   - 完成学习后上传改进作品
   - 查看AI分析的学习进步报告

### 教师使用建议

1. **课前准备**
   - 确保学生了解基本登录流程
   - 准备桥梁设计相关材料

2. **课程进行**
   - 引导学生使用设计评估功能
   - 鼓励学生使用智能问答系统
   - 实时解答学生疑问

3. **课后评估**
   - 指导学生上传作品照片
   - 分析学习效果数据
   - 提供个性化学习建议

## 🔧 自定义配置

### 修改评估算法

在 `components/BridgeDesigner.tsx` 中的 `calculateFeasibilityScore` 函数中调整评分逻辑：

```typescript
const calculateFeasibilityScore = (design: BridgeDesign): number => {
  // 自定义评分算法
  let score = 0
  // 添加您的评分逻辑
  return Math.min(score, 100)
}
```

### 扩展问答知识库

在 `app/api/chat/route.ts` 中的 `getEnhancedAIResponse` 函数中添加新的问答逻辑：

```typescript
const getEnhancedAIResponse = (message: string): string => {
  // 添加新的问答逻辑
  if (lowerMessage.includes('您的问题关键词')) {
    return '您的回答内容'
  }
  // 默认回答
  return '默认回答内容'
}
```

## 📊 数据存储

应用使用本地存储（localStorage）保存用户数据，包括：
- 用户登录信息
- 桥梁设计方案
- 学习进度记录
- 聊天历史

## 🚀 部署指南

### Vercel 部署（推荐）

⚠️ **重要提示**: Vercel 是无服务器环境，文件系统是只读的，因此 **必须使用 MySQL 数据库**，不能使用 SQLite。

#### 快速部署步骤

1. **准备 MySQL 数据库**
   - 使用 [PlanetScale](https://planetscale.com/)、[Supabase](https://supabase.com/) 或其他 MySQL 托管服务
   - 创建数据库并获取连接信息

2. **部署到 Vercel**
   - 将代码推送到 GitHub
   - 在 [Vercel](https://vercel.com/) 中导入项目
   - 配置环境变量（见下方）

3. **配置环境变量**
   
   在 Vercel 项目设置中添加以下环境变量：
   
   ```env
   # 数据库配置（必须使用 MySQL）
   DB_TYPE=mysql
   DB_HOST=你的MySQL主机地址
   DB_PORT=3306
   DB_USER=你的MySQL用户名
   DB_PASSWORD=你的MySQL密码
   DB_NAME=你的数据库名
   
   # Coze AI 配置（可选）
   COZE_API_KEY=你的扣子API密钥
   COZE_BOT_ID=你的Bot ID
   ```

4. **初始化数据库**
   - 首次部署后，访问应用会自动创建数据库表
   - 或使用 MySQL 客户端手动创建表结构

5. **导入学生数据**
   - 使用批量导入 API 或直接连接数据库插入数据

📖 **详细部署指南**: 请查看 [Vercel部署指南](docs/Vercel部署指南.md)

### 其他平台

- **Netlify**：支持静态站点部署
- **Railway**：支持全栈应用部署
- **自建服务器**：使用 PM2 管理进程

⚠️ **注意**: 所有生产环境都建议使用 MySQL 数据库。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持与反馈

如有问题或建议，请通过以下方式联系：

- 创建 Issue
- 发送邮件至项目维护者
- 参与社区讨论

## 🎓 教育价值

本应用旨在：
- 提升学生对桥梁工程的理解
- 培养结构设计思维
- 增强STEM学习兴趣
- 提供个性化学习体验

## 🔮 未来计划

- [ ] 集成真实AI大模型API
- [ ] 添加3D桥梁可视化
- [ ] 支持多语言界面
- [ ] 增加协作功能
- [ ] 移动端适配

---

**神奇木结构** - 让桥梁学习更有趣，让STEM教育更生动！