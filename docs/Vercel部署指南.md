# Vercel 部署指南

本文档说明如何在 Vercel 上部署此项目。

## ⚠️ 重要提示

**Vercel 是无服务器环境，文件系统是只读的，因此 SQLite 无法正常工作。部署到 Vercel 必须使用 MySQL 数据库。**

## 前置要求

1. Vercel 账号
2. MySQL 数据库（可以使用以下服务之一）：
   - [Railway](https://railway.app/)（推荐，免费额度 $5/月）
   - [Render](https://render.com/)（免费套餐可用）
   - [Aiven](https://aiven.io/)（免费试用）
   - [Free MySQL Hosting](https://www.freemysqlhosting.net/)（免费 MySQL 托管）
   - [db4free.net](https://www.db4free.net/)（免费 MySQL 数据库）
   - 或其他 MySQL 托管服务
   - 自建 MySQL 服务器（需要有公网IP）

⚠️ **注意**: PlanetScale 已取消免费套餐。如果需要免费 MySQL 数据库，建议使用上述替代方案。

## 部署步骤

### 1. 准备 MySQL 数据库

选择一个 MySQL 托管服务并创建数据库：

#### 方案 A: 使用 Railway（推荐，免费额度 $5/月）

1. 访问 [Railway](https://railway.app/) 并注册账号（使用 GitHub 账号登录）
2. 创建新项目
3. 点击 **"New"** → 选择 **"Database"** → 选择 **"MySQL"**
4. Railway 会自动创建 MySQL 数据库
5. 点击 MySQL 服务卡片
6. 在 **Variables** 标签中查看连接信息：
   - `MYSQLHOST` → 这是 **DB_HOST**
   - `MYSQLPORT` → 这是 **DB_PORT**（通常是 3306）
   - `MYSQLUSER` → 这是 **DB_USER**
   - `MYSQLPASSWORD` → 这是 **DB_PASSWORD**
   - `MYSQLDATABASE` → 这是 **DB_NAME**

#### 方案 B: 使用 Render（免费套餐）

1. 访问 [Render](https://render.com/) 并注册账号
2. 点击 **"New +"** → 选择 **"PostgreSQL"** 或 **"MySQL"**（如果可用）
3. 创建免费数据库实例
4. 在数据库详情页查看连接信息：
   - **Host** → DB_HOST
   - **Port** → DB_PORT
   - **Database** → DB_NAME
   - **User** → DB_USER
   - **Password** → DB_PASSWORD

#### 方案 C: 使用 db4free.net（完全免费）

1. 访问 [db4free.net](https://www.db4free.net/)
2. 点击 **"Sign up"** 注册账号
3. 创建新数据库
4. 获取连接信息（在注册确认邮件中）
   - **Host**: 通常是 `db4free.net`
   - **Port**: `3306`
   - 用户名、密码和数据库名在注册时设置

#### 方案 D: 使用其他服务

1. 访问服务的官网并注册账号
2. 创建 MySQL 数据库
3. 在服务控制台中查找连接信息（通常在 "Connection" 或 "Settings" 页面）

### 2. 在 Vercel 中部署项目

#### 方法 A: 通过 GitHub 部署（推荐）

1. 确保项目已推送到 GitHub
2. 登录 [Vercel](https://vercel.com/)
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. 配置项目设置（框架预设会自动检测为 Next.js）

#### 方法 B: 使用 Vercel CLI

```bash
npm i -g vercel
vercel
```

### 3. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

#### 必需的环境变量

```env
# 数据库配置（必须使用 MySQL）
DB_TYPE=mysql
DB_HOST=你的MySQL主机地址
DB_PORT=3306
DB_USER=你的MySQL用户名
DB_PASSWORD=你的MySQL密码
DB_NAME=你的数据库名
DB_CONNECTION_LIMIT=10
DB_WAIT_FOR_CONNECTIONS=true
DB_QUEUE_LIMIT=0
```

#### Coze AI 配置（可选）

```env
# 扣子智能体配置
COZE_API_KEY=你的扣子API密钥
COZE_BOT_ID=你的Bot ID
```

#### 如何添加环境变量

1. 在 Vercel 项目页面，点击 **Settings**（设置）
2. 点击 **Environment Variables**（环境变量）
3. 添加每个环境变量：
   - **Name（名称）**: 变量名（如 `DB_TYPE`）
   - **Value（值）**: 变量值（如 `mysql`）
   - **Environments（环境）**: 选择 `Production`、`Preview`、`Development`（根据需要）

### 4. 初始化数据库表

部署后，数据库表会在首次访问时自动创建。但为了确保一切正常，你可以：

#### 方法 A: 访问登录页面自动初始化

1. 访问你的 Vercel 部署地址
2. 尝试登录（即使会失败）
3. 系统会自动创建数据库表

#### 方法 B: 使用脚本初始化（推荐）

创建一个临时的 API 路由来初始化数据库，或使用 MySQL 客户端连接到数据库并执行：

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

### 5. 导入学生数据

数据库初始化后，需要导入学生数据。你可以：

#### 方法 A: 使用 API 批量导入

通过 `/api/students/batch` 端点导入数据：

```bash
curl -X POST https://你的域名.vercel.app/api/students/batch \
  -H "Content-Type: application/json" \
  -d @students.json
```

#### 方法 B: 使用 MySQL 客户端

直接连接 MySQL 数据库并插入数据。

### 6. 验证部署

1. 访问你的 Vercel 部署地址
2. 尝试使用组长账号登录
3. 检查是否正常工作

## 常见问题

### Q: 登录时显示"数据库配置错误"或"数据库连接失败"

**A:** 检查以下几点：

1. **环境变量是否已正确配置**
   - 在 Vercel 项目设置中检查所有数据库相关的环境变量
   - 确保 `DB_TYPE=mysql`（不是 `sqlite`）

2. **MySQL 连接信息是否正确**
   - Host、Port、Username、Password、Database name 是否正确
   - 某些托管服务可能使用不同的端口

3. **MySQL 数据库是否允许远程连接**
   - 如果使用自建 MySQL，确保允许 Vercel 的 IP 地址连接
   - PlanetScale 和 Supabase 默认允许远程连接

4. **数据库表是否已创建**
   - 首次部署后需要初始化数据库表
   - 查看 Vercel 的函数日志，确认是否有数据库初始化错误

### Q: 如何查看 Vercel 部署日志？

**A:** 
1. 在 Vercel 项目页面
2. 点击 **Deployments**（部署）
3. 选择最近的部署
4. 点击 **Functions**（函数）查看日志

### Q: 可以使用 SQLite 吗？

**A:** 不可以。Vercel 的文件系统是只读的，SQLite 需要写入文件，因此无法在 Vercel 上使用。必须使用 MySQL 或其他远程数据库。

### Q: 如何备份数据库？

**A:** 根据你使用的 MySQL 服务：
- **PlanetScale**: 自动备份，可在控制台查看
- **Supabase**: 提供自动备份功能
- **自建 MySQL**: 使用 `mysqldump` 命令定期备份

### Q: 环境变量在哪个环境生效？

**A:** 在 Vercel 中添加环境变量时，可以选择：
- **Production**: 生产环境
- **Preview**: 预览环境（PR部署）
- **Development**: 本地开发环境

建议所有环境都配置相同的数据库连接信息。

## 安全建议

1. **不要将敏感信息提交到 Git**
   - `.env` 文件已添加到 `.gitignore`
   - 所有敏感信息应通过 Vercel 环境变量配置

2. **使用专用数据库用户**
   - 不要使用 root 用户
   - 创建专用数据库用户，只授予必要权限

3. **定期更新密码**
   - 定期更换数据库密码
   - 定期更换 API 密钥

4. **启用 HTTPS**
   - Vercel 自动为所有部署启用 HTTPS
   - 确保始终使用 HTTPS 访问

## 性能优化

1. **使用连接池**
   - 系统已配置连接池（`DB_CONNECTION_LIMIT=10`）
   - 可根据需要调整连接池大小

2. **使用 CDN**
   - Vercel 自动使用 CDN 加速静态资源

3. **启用数据库索引**
   - 系统已自动创建必要的索引

## 下一步

部署成功后：
1. ✅ 配置学生数据
2. ✅ 测试登录功能
3. ✅ 配置 Coze AI 智能体（可选）
4. ✅ 测试所有功能

## 相关文档

- [数据库配置指南](./数据库配置.md)
- [批量导入学生数据](./批量导入学生数据.md)
- [扣子智能体配置指南](./扣子智能体配置指南.md)

