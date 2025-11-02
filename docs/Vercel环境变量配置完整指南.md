# Vercel 环境变量配置完整指南

本指南将详细说明如何在 Vercel 中配置 MySQL 数据库环境变量。

## 📋 准备工作

在开始之前，确保你已经：
- ✅ 在 Railway 中创建了 MySQL 数据库
- ✅ 获得了 Railway 的连接信息（Variables 标签）

## 🎯 步骤 1: 获取 Railway 连接信息

### 1.1 在 Railway 中查看连接信息

1. **登录 Railway**
   - 访问 https://railway.app
   - 使用 GitHub 账号登录

2. **进入 MySQL 服务**
   - 在你的项目中，找到 MySQL 数据库服务
   - 点击 MySQL 服务卡片

3. **查看 Variables（变量）**
   - 点击 **"Variables"** 标签
   - 你会看到以下变量（记录这些值）：

   ```
   MYSQLHOST=containers-us-west-xxx.railway.app
   MYSQLPORT=3306
   MYSQLUSER=root
   MYSQLPASSWORD=xxxxxxxxxxxxx
   MYSQLDATABASE=railway
   ```

   ⚠️ **重要**: 复制这些值，稍后需要在 Vercel 中使用

## 🎯 步骤 2: 在 Vercel 中配置环境变量

### 2.1 进入 Vercel 项目设置

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 登录你的账号

2. **选择项目**
   - 在 Dashboard 中找到你的项目 `wood-bridge-structure`
   - 点击项目名称进入项目页面

3. **打开设置**
   - 点击顶部导航栏的 **"Settings"**（设置）标签

### 2.2 添加环境变量

1. **进入环境变量页面**
   - 在左侧菜单中，点击 **"Environment Variables"**（环境变量）

2. **添加第一个变量：DB_TYPE**

   - 点击 **"Add New"**（添加新变量）按钮
   - 填写：
     - **Key（键）**: `DB_TYPE`
     - **Value（值）**: `mysql`
     - **Environments（环境）**: 
       - ✅ 勾选 **Production**
       - ✅ 勾选 **Preview**（可选）
       - ✅ 勾选 **Development**（可选，如果你想在本地也用相同的配置）
   - 点击 **"Save"**（保存）

3. **添加第二个变量：DB_HOST**

   - 再次点击 **"Add New"**
   - 填写：
     - **Key**: `DB_HOST`
     - **Value**: 从 Railway Variables 复制的 `MYSQLHOST` 值
       - 例如：`containers-us-west-xxx.railway.app`
     - **Environments**: 勾选 **Production**（和其他环境，如果需要）
   - 点击 **"Save"**

4. **添加第三个变量：DB_PORT**

   - **Key**: `DB_PORT`
   - **Value**: `3306`
     - 或者使用 Railway Variables 中的 `MYSQLPORT` 值（通常是 3306）
   - **Environments**: 勾选 **Production**
   - 点击 **"Save"**

5. **添加第四个变量：DB_USER**

   - **Key**: `DB_USER`
   - **Value**: 从 Railway Variables 复制的 `MYSQLUSER` 值
     - 例如：`root`
   - **Environments**: 勾选 **Production**
   - 点击 **"Save"**

6. **添加第五个变量：DB_PASSWORD**

   - **Key**: `DB_PASSWORD`
   - **Value**: 从 Railway Variables 复制的 `MYSQLPASSWORD` 值
     - ⚠️ **注意**: 这是一个敏感信息，确保正确复制，不要有空格
   - **Environments**: 勾选 **Production**
   - 点击 **"Save"**

7. **添加第六个变量：DB_NAME**

   - **Key**: `DB_NAME`
   - **Value**: 从 Railway Variables 复制的 `MYSQLDATABASE` 值
     - 例如：`railway`
   - **Environments**: 勾选 **Production**
   - 点击 **"Save"**

### 2.3 验证环境变量

添加完所有变量后，你应该看到以下列表：

| Key | Value（部分显示） | Environments |
|-----|------------------|--------------|
| `DB_TYPE` | `mysql` | Production |
| `DB_HOST` | `containers-us-west-xxx.railway.app` | Production |
| `DB_PORT` | `3306` | Production |
| `DB_USER` | `root` | Production |
| `DB_PASSWORD` | `••••••••••••` | Production |
| `DB_NAME` | `railway` | Production |

## 🎯 步骤 3: 重新部署应用

### 3.1 触发重新部署

环境变量更改后，Vercel 需要重新部署才能生效。有两种方式：

#### 方法 A: 自动重新部署（推荐）

1. **推送代码到 GitHub**（如果有代码更改）
   ```bash
   git add .
   git commit -m "Update configuration"
   git push origin main
   ```
   - Vercel 会自动检测并重新部署

#### 方法 B: 手动重新部署

1. **在 Vercel 控制台**
   - 点击顶部导航的 **"Deployments"**（部署）标签
   - 找到最新的部署记录
   - 点击右侧的 **"..."** 菜单
   - 选择 **"Redeploy"**（重新部署）

2. **或者创建空提交触发**
   ```bash
   git commit --allow-empty -m "Trigger redeploy after env vars update"
   git push origin main
   ```

### 3.2 等待部署完成

- 在 **Deployments** 页面查看部署状态
- 等待部署完成（通常需要 1-2 分钟）
- 状态应该显示 **"Ready"**（就绪）

## 🎯 步骤 4: 验证配置

### 4.1 访问诊断端点

部署完成后，访问诊断端点验证配置：

```
https://wood-bridge-structure.vercel.app/api/diagnostic
```

### 4.2 检查诊断结果

应该看到：

```json
{
  "checks": {
    "databaseType": {
      "status": "ok",
      "actualType": "mysql",
      "message": "✅ 当前使用: MYSQL"
    },
    "databaseConnection": {
      "status": "ok",
      "message": "数据库连接成功"
    },
    "environment": {
      "status": "ok",
      "dbType": "mysql",
      "message": "✅ 环境变量配置正常"
    }
  }
}
```

### 4.3 检查表是否自动创建

在诊断结果中查看：

```json
{
  "checks": {
    "tableExists": {
      "status": "ok",
      "message": "students 表已存在"
    }
  }
}
```

如果显示表不存在，访问登录页面会自动创建表。

## 🎯 步骤 5（可选）: 在 Railway 中手动创建表

如果你不想等待应用自动创建表，可以手动在 Railway 中创建：

### 5.1 使用 Railway 的 Query 功能

1. **在 Railway MySQL 服务中**
   - 点击 **"Database"** 标签
   - 找到 **"Query"** 或 **"SQL"** 区域

2. **执行 SQL 语句**

   在 SQL 编辑器中粘贴以下 SQL：

   ```sql
   CREATE TABLE IF NOT EXISTS students (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     grade VARCHAR(50) NOT NULL,
     studentId VARCHAR(50) NOT NULL UNIQUE,
     gender ENUM('男', '女') NOT NULL,
     role ENUM('组长', '组员') NOT NULL,
     groupName VARCHAR(100) NOT NULL,
     groupPassword VARCHAR(100) NOT NULL,
     createdAt DATETIME,
     updatedAt DATETIME,
     INDEX idx_studentId (studentId),
     INDEX idx_groupName (groupName),
     INDEX idx_role (role),
     INDEX idx_name_group (name, groupName)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

3. **执行查询**
   - 点击 **"Run"** 或 **"Execute"** 按钮
   - 应该看到成功消息

### 5.2 使用 MySQL Workbench（更推荐）

1. **下载 MySQL Workbench**
   - 访问 https://dev.mysql.com/downloads/workbench/
   - 下载并安装

2. **创建新连接**
   - 打开 MySQL Workbench
   - 点击 **"+"** 创建新连接
   - 填入 Railway 的连接信息：
     - **Connection Name**: Railway MySQL
     - **Hostname**: Railway Variables 中的 `MYSQLHOST`
     - **Port**: `3306`
     - **Username**: Railway Variables 中的 `MYSQLUSER`
     - **Password**: 点击 **"Store in Keychain"** 并输入 Railway Variables 中的 `MYSQLPASSWORD`

3. **连接并执行 SQL**
   - 点击 **"Test Connection"** 测试连接
   - 连接成功后，在 SQL 编辑器中执行上面的 SQL 语句

## ✅ 配置检查清单

完成配置后，确认以下所有项：

- [ ] 在 Railway Variables 中记录了所有连接信息
- [ ] 在 Vercel 中添加了 `DB_TYPE=mysql`
- [ ] 在 Vercel 中添加了 `DB_HOST`（Railway 的 MYSQLHOST）
- [ ] 在 Vercel 中添加了 `DB_PORT=3306`
- [ ] 在 Vercel 中添加了 `DB_USER`（Railway 的 MYSQLUSER）
- [ ] 在 Vercel 中添加了 `DB_PASSWORD`（Railway 的 MYSQLPASSWORD）
- [ ] 在 Vercel 中添加了 `DB_NAME`（Railway 的 MYSQLDATABASE）
- [ ] 所有环境变量都勾选了 **Production** 环境
- [ ] 已重新部署 Vercel 应用
- [ ] 访问诊断端点验证配置成功
- [ ] students 表已创建（自动或手动）

## 🐛 常见问题

### 问题 1: 环境变量添加后不生效

**解决方案**:
- 确保已重新部署应用
- 检查环境变量是否正确保存
- 清除浏览器缓存后重新访问

### 问题 2: 诊断端点显示仍使用 SQLite

**解决方案**:
- 检查 `DB_TYPE` 的值是否为 `mysql`（小写）
- 确认没有多余的空格
- 重新部署应用

### 问题 3: 数据库连接失败

**解决方案**:
- 检查 Railway Variables 中的值是否正确复制
- 确认 `DB_HOST` 是 Railway 提供的主机地址，不是 `localhost`
- 测试从本地能否连接到 Railway 数据库

### 问题 4: 表创建失败

**解决方案**:
- 访问登录页面，应用会自动尝试创建表
- 或手动执行 SQL 创建表
- 查看 Vercel 日志中的错误信息

## 📚 相关文档

- [为什么Vercel无法访问本地MySQL](./为什么Vercel无法访问本地MySQL.md)
- [Railway创建students表指南](./Railway创建students表指南.md)
- [Vercel部署指南](./Vercel部署指南.md)

## 🎉 完成！

配置完成后，你的应用应该能够：
- ✅ 连接到 Railway 的 MySQL 数据库
- ✅ 自动创建 students 表
- ✅ 支持学生登录功能

现在可以访问你的应用并测试登录功能了！

