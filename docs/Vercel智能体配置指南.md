# Vercel 智能体（Coze API）配置指南

## 问题：智能体无法调用

如果在 Vercel 上部署后，智能体无法调用，通常是因为环境变量未配置。

## 解决方案

### 步骤 1：登录 Vercel 控制台

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到您的项目：`Wood-bridge-structure`
3. 点击进入项目设置

### 步骤 2：添加环境变量

1. 在项目页面，点击 **Settings**（设置）
2. 点击左侧的 **Environment Variables**（环境变量）
3. 添加以下两个环境变量：

#### 环境变量 1：COZE_API_KEY

```
变量名：COZE_API_KEY
值：pat_yqeqvCpWcmBMBfEZjEZbM71LMdwSOXoAWxzfbOpKGSGaXeaHJvAjGZOgHY3khQpW
```

**重要**：
- 勾选 **Production**（生产环境）
- 勾选 **Preview**（预览环境）
- 勾选 **Development**（开发环境，可选）

#### 环境变量 2：COZE_BOT_ID

```
变量名：COZE_BOT_ID
值：7568187181043859490
```

**重要**：
- 勾选 **Production**（生产环境）
- 勾选 **Preview**（预览环境）
- 勾选 **Development**（开发环境，可选）

### 步骤 3：重新部署

添加环境变量后，需要重新部署才能生效：

1. 点击 **Deployments**（部署）标签
2. 找到最新的部署记录
3. 点击右侧的 **...**（三个点）菜单
4. 选择 **Redeploy**（重新部署）
5. 或者推送一个空提交到 GitHub 触发自动部署

```bash
git commit --allow-empty -m "Trigger redeploy for environment variables"
git push origin main
```

### 步骤 4：验证配置

部署完成后，访问诊断端点验证配置：

```
https://你的域名.vercel.app/api/diagnostic
```

在响应中查找 `checks.cozeApi` 部分，应该显示：

```json
{
  "cozeApi": {
    "status": "ok",
    "hasApiKey": true,
    "hasBotId": true,
    "message": "✅ Coze API 配置正常，智能体可用"
  }
}
```

如果显示错误，检查：

1. 环境变量名称是否正确（区分大小写）
2. 环境变量值是否正确
3. 是否勾选了 Production 环境
4. 是否已重新部署

## 当前配置值

### API Key
```
COZE_API_KEY=pat_yqeqvCpWcmBMBfEZjEZbM71LMdwSOXoAWxzfbOpKGSGaXeaHJvAjGZOgHY3khQpW
```

### Bot ID
```
COZE_BOT_ID=7568187181043859490
```

## 快速检查清单

- [ ] 已添加 `COZE_API_KEY` 环境变量
- [ ] 已添加 `COZE_BOT_ID` 环境变量
- [ ] 两个变量都已勾选 **Production** 环境
- [ ] 已重新部署项目
- [ ] 访问 `/api/diagnostic` 验证配置成功
- [ ] 测试聊天功能，智能体正常响应

## 常见问题

### Q: 为什么本地可以调用，但 Vercel 上不行？

A: 本地开发使用的是 `.env` 文件中的配置，但 Vercel 需要使用环境变量。两者是独立的，需要在 Vercel 中单独配置。

### Q: 添加环境变量后需要等待多久？

A: 添加环境变量后，需要重新部署才能生效。通常部署需要 1-3 分钟。

### Q: 如何确认环境变量已生效？

A: 访问 `/api/diagnostic` 端点，查看 `checks.cozeApi` 的状态。如果 `status` 是 `ok`，说明配置成功。

### Q: 环境变量配置错误会怎样？

A: 如果环境变量未配置或配置错误，智能体将使用本地回答系统作为后备方案。您可以正常使用，但无法享受 Coze AI 的智能回答。

## 详细步骤截图说明

1. **进入项目设置**
   - Vercel Dashboard → 项目 → Settings

2. **打开环境变量**
   - Settings → Environment Variables

3. **添加变量**
   - 点击 "Add New"
   - 输入变量名和值
   - 勾选 Production
   - 点击 "Save"

4. **重新部署**
   - Deployments → 最新部署 → ... → Redeploy

配置完成后，智能体应该可以正常调用了！

