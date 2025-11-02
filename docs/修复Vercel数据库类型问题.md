# 修复 Vercel 显示 SQLite 的问题

## 问题说明

如果你在使用 MySQL 数据库，但在 Vercel 部署中显示使用的是 SQLite，这是因为 **环境变量 `DB_TYPE` 没有正确配置**。

## 原因分析

系统会根据环境变量 `DB_TYPE` 来决定使用哪种数据库：

- 如果 `DB_TYPE=mysql` → 使用 MySQL
- 如果 `DB_TYPE` 未设置或为空 → **默认使用 SQLite** ❌

这就是为什么在 Vercel 上显示 SQLite 的原因。

## 解决方案

### 步骤 1: 在 Vercel 中设置环境变量

1. **登录 Vercel 控制台**
   - 访问 [https://vercel.com](https://vercel.com)
   - 登录你的账号

2. **进入项目设置**
   - 选择你的项目 `wood-bridge-structure`
   - 点击 **Settings**（设置）标签

3. **添加环境变量**
   - 点击左侧菜单的 **Environment Variables**（环境变量）
   - 添加以下环境变量：

#### 必需的环境变量：

```env
DB_TYPE=mysql
DB_HOST=你的MySQL主机地址
DB_PORT=3306
DB_USER=你的MySQL用户名
DB_PASSWORD=你的MySQL密码
DB_NAME=你的数据库名
```

#### 详细步骤：

对于每个变量：

1. 点击 **Add New**（添加新变量）
2. **Key（键）**: 输入变量名（如 `DB_TYPE`）
3. **Value（值）**: 输入变量值（如 `mysql`）
4. **Environments（环境）**: 
   - ✅ 勾选 **Production**（生产环境）
   - ✅ 勾选 **Preview**（预览环境，可选）
   - ✅ 勾选 **Development**（开发环境，可选）
5. 点击 **Save**（保存）

### 步骤 2: 验证环境变量

添加完所有环境变量后：

1. **检查列表**
   - 确认所有变量都已添加
   - 特别注意 `DB_TYPE` 的值应该是 `mysql`（小写）

2. **重新部署**
   - 环境变量更改后需要重新部署才能生效
   - 可以：
     - 手动触发重新部署（Redeploy）
     - 或者推送一个空提交到 GitHub 触发自动部署：
       ```bash
       git commit --allow-empty -m "Trigger redeploy after env vars"
       git push origin main
       ```

### 步骤 3: 验证修复

部署完成后：

1. **访问诊断端点**
   ```
   https://wood-bridge-structure.vercel.app/api/diagnostic
   ```

2. **检查结果**
   - 查看 `databaseType` 部分
   - 应该显示：
     ```json
     {
       "status": "ok",
       "actualType": "mysql",
       "message": "✅ 当前使用: MYSQL"
     }
     ```
   - 查看 `environment` 部分
     - `dbType` 应该显示 `mysql`
     - `message` 应该显示 `✅ 环境变量配置正常`

3. **查看服务器日志**
   - 在 Vercel 控制台的 **Functions** 日志中
   - 应该看到：`使用 MySQL 数据库`

## 常见错误

### ❌ 错误 1: 变量名拼写错误

**错误示例**:
- `db_type` (应该是 `DB_TYPE`)
- `DBTYPE` (应该是 `DB_TYPE`)
- `DB_TYPE ` (末尾有空格)

**正确**: `DB_TYPE`

### ❌ 错误 2: 值大小写错误

**错误示例**:
- `DB_TYPE=MySQL` (应该是小写 `mysql`)
- `DB_TYPE=MYSQL` (应该是小写 `mysql`)

**正确**: `DB_TYPE=mysql`

### ❌ 错误 3: 只在部分环境设置

**问题**: 只在 Production 设置，但没有在 Preview 设置

**解决**: 确保所有需要的环境都勾选了

### ❌ 错误 4: 忘记重新部署

**问题**: 添加了环境变量但没有重新部署

**解决**: 环境变量更改后必须重新部署才能生效

## 快速检查清单

在 Vercel 环境变量中确认：

- [ ] `DB_TYPE` = `mysql`（小写）
- [ ] `DB_HOST` = 你的 MySQL 主机地址
- [ ] `DB_PORT` = `3306`（或你的 MySQL 端口）
- [ ] `DB_USER` = 你的 MySQL 用户名
- [ ] `DB_PASSWORD` = 你的 MySQL 密码
- [ ] `DB_NAME` = 你的数据库名
- [ ] 所有变量都已勾选 **Production** 环境
- [ ] 已重新部署项目

## 验证命令

部署后，访问诊断端点检查：

```bash
curl https://wood-bridge-structure.vercel.app/api/diagnostic
```

或者直接在浏览器中打开：
```
https://wood-bridge-structure.vercel.app/api/diagnostic
```

查看 JSON 响应中的 `checks.databaseType.actualType`，应该显示 `"mysql"`。

## 如果仍然显示 SQLite

如果设置完环境变量并重新部署后仍然显示 SQLite：

1. **再次检查环境变量**
   - 确认变量名完全正确：`DB_TYPE`
   - 确认值完全正确：`mysql`（小写，无空格）

2. **清除构建缓存**
   - Vercel 设置 → General → Clear Build Cache
   - 然后重新部署

3. **检查部署日志**
   - 查看构建日志，确认环境变量被正确读取
   - 查看 Functions 日志，查看实际使用的数据库类型

4. **使用诊断端点**
   - 访问 `/api/diagnostic`
   - 查看详细的诊断信息，包括环境变量值

## 相关文档

- [Vercel 部署指南](./Vercel部署指南.md)
- [数据库配置指南](./数据库配置.md)
- [部署故障排除](./部署故障排除.md)

