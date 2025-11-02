# 如何获取 MySQL 主机地址和连接信息

根据你使用的 MySQL 服务，获取连接信息的方法不同。以下是常见服务的详细说明：

## 🔍 方法 1: Railway（推荐，免费额度 $5/月）

Railway 提供每月 $5 的免费额度，非常适合小型项目。

### 获取连接信息：

1. **登录 Railway**
   - 访问 [https://railway.app](https://railway.app)
   - 使用 GitHub 账号登录

2. **创建 MySQL 数据库**
   - 在项目中点击 **"New"** → **"Database"** → **"MySQL"**
   - Railway 会自动创建并配置 MySQL 数据库

3. **获取连接信息**
   - 点击 MySQL 服务卡片
   - 切换到 **Variables**（变量）标签
   - 你会看到以下变量：
     - `MYSQLHOST` → 这是 **DB_HOST**
     - `MYSQLPORT` → 这是 **DB_PORT**（通常是 3306）
     - `MYSQLUSER` → 这是 **DB_USER**
     - `MYSQLPASSWORD` → 这是 **DB_PASSWORD**
     - `MYSQLDATABASE` → 这是 **DB_NAME**

### 示例：

从 Variables 中复制这些值到 Vercel 环境变量：
- **DB_HOST** = `containers-us-west-xxx.railway.app`
- **DB_PORT** = `3306`
- **DB_USER** = `root`
- **DB_PASSWORD** = `xxxxxxxxxxxx`
- **DB_NAME** = `railway`

---

## 🔍 方法 1.1: PlanetScale（付费服务）

⚠️ **注意**: PlanetScale 已于 2024 年 4 月取消了免费套餐，现在需要付费使用。

如果你已付费使用 PlanetScale：

### 获取连接信息：

1. **登录 PlanetScale**
   - 访问 [https://planetscale.com](https://planetscale.com)
   - 登录你的账号

2. **选择数据库**
   - 在控制台中选择你的数据库

3. **获取连接信息**
   - 点击 **"Connect"** 或 **"连接"** 按钮
   - 选择 **"Connect with: MySQL"**
   - 你会看到连接字符串，格式如下：
     ```
     mysql://用户名:密码@主机地址:端口/数据库名
     ```

4. **提取信息**
   从连接字符串中提取各部分信息

---

## 🔍 方法 2: Render（免费套餐）

Render 提供免费的 PostgreSQL 和 MySQL 数据库（有限制）。

### 获取连接信息：

1. **登录 Render**
   - 访问 [https://render.com](https://render.com)
   - 注册账号

2. **创建数据库**
   - 点击 **"New +"** → **"PostgreSQL"** 或 **"MySQL"**
   - 选择免费套餐（如果可用）

3. **获取连接信息**
   - 在数据库详情页面
   - 查看 **Connection Info** 部分：
     - **Host** → DB_HOST
     - **Port** → DB_PORT
     - **Database** → DB_NAME
     - **User** → DB_USER
     - **Password** → DB_PASSWORD

---

## 🔍 方法 2.1: db4free.net（完全免费）

db4free.net 提供完全免费的 MySQL 数据库（适合测试和学习）。

### 获取连接信息：

1. **注册账号**
   - 访问 [https://www.db4free.net](https://www.db4free.net)
   - 点击 **"Sign up"** 注册

2. **创建数据库**
   - 登录后创建新数据库
   - 设置数据库名、用户名和密码

3. **获取连接信息**
   - 连接信息通常为：
     - **DB_HOST** = `db4free.net`
     - **DB_PORT** = `3306`
     - **DB_USER** = 你注册的用户名
     - **DB_PASSWORD** = 你设置的密码
     - **DB_NAME** = 你创建的数据库名

⚠️ **注意**: db4free.net 是免费服务，可能有性能和稳定性限制，适合测试和小型项目。

---

## 🔍 方法 2.2: Supabase

Supabase 提供 PostgreSQL，但也支持 MySQL（通过 Supabase for MySQL 或自建）。

### 获取连接信息：

1. **登录 Supabase**
   - 访问 [https://supabase.com](https://supabase.com)
   - 登录你的账号

2. **进入项目设置**
   - 选择你的项目
   - 点击左侧菜单的 **Settings**（设置）
   - 点击 **Database**

3. **获取连接信息**
   - 在 **Connection string** 部分
   - 选择 **URI** 或 **Connection pooling**
   - 你会看到连接字符串

4. **提取信息**
   类似于 PlanetScale 的方式提取各部分信息

---

## 🔍 方法 3: Railway

Railway 是一个现代化的应用部署平台，也提供 MySQL 数据库。

### 获取连接信息：

1. **登录 Railway**
   - 访问 [https://railway.app](https://railway.app)
   - 登录你的账号

2. **查看服务**
   - 在项目中找到 MySQL 服务
   - 点击 MySQL 服务卡片

3. **获取连接信息**
   - 点击 **Variables**（变量）标签
   - 你会看到以下变量：
     - `MYSQLHOST` → 这是 **DB_HOST**
     - `MYSQLPORT` → 这是 **DB_PORT**
     - `MYSQLUSER` → 这是 **DB_USER**
     - `MYSQLPASSWORD` → 这是 **DB_PASSWORD**
     - `MYSQLDATABASE` → 这是 **DB_NAME**

---

## 🔍 方法 4: Azure Database for MySQL

如果你使用微软 Azure 的 MySQL 服务。

### 获取连接信息：

1. **登录 Azure 门户**
   - 访问 [https://portal.azure.com](https://portal.azure.com)
   - 登录你的账号

2. **找到 MySQL 服务器**
   - 在搜索栏搜索 "MySQL servers"
   - 选择你的 MySQL 服务器

3. **获取连接信息**
   - 在 **Overview**（概览）页面
   - **Server name** → 这是 **DB_HOST**（格式：`xxxx.mysql.database.azure.com`）
   - 点击 **Connection strings**（连接字符串）
   - 查看 **JDBC** 或 **MySQL** 连接字符串

4. **提取信息**
   - 主机地址：`xxxx.mysql.database.azure.com`
   - 端口：通常是 `3306`
   - 用户名和密码：在连接字符串中或单独设置

---

## 🔍 方法 5: AWS RDS (Amazon Relational Database Service)

如果你使用亚马逊 AWS 的 RDS MySQL 服务。

### 获取连接信息：

1. **登录 AWS 控制台**
   - 访问 [https://console.aws.amazon.com](https://console.aws.amazon.com)
   - 登录你的账号

2. **打开 RDS 控制台**
   - 在服务中搜索 "RDS"
   - 点击进入 RDS 控制台

3. **选择数据库实例**
   - 在 **Databases** 列表中
   - 点击你的 MySQL 数据库实例

4. **获取连接信息**
   - 在 **Connectivity & security**（连接和安全）部分
   - **Endpoint** → 这是 **DB_HOST**（格式：`xxxx.xxxxx.us-east-1.rds.amazonaws.com`）
   - **Port** → 这是 **DB_PORT**（通常是 `3306`）
   - **Master username** → 这是 **DB_USER**
   - **Master password** → 这是 **DB_PASSWORD**（在创建时设置）

---

## 🔍 方法 6: 自建 MySQL 服务器

如果你在自己服务器上安装了 MySQL。

### 获取连接信息：

1. **服务器IP地址或域名**
   - 如果你从外部访问：使用公网 IP 或域名
   - 如果是本地访问：使用 `localhost` 或 `127.0.0.1`

2. **端口**
   - MySQL 默认端口是 `3306`

3. **用户名和密码**
   - 你在创建数据库时设置的用户名和密码
   - 或者 MySQL root 用户的用户名和密码

4. **数据库名**
   - 你创建的数据库名称

### 检查 MySQL 是否可以从外部访问：

```bash
# 检查 MySQL 是否在监听
netstat -an | grep 3306

# 或者使用 ss 命令
ss -tlnp | grep 3306
```

### 确保防火墙允许连接：

```bash
# Ubuntu/Debian
sudo ufw allow 3306/tcp

# CentOS/RHEL
sudo firewall-cmd --add-port=3306/tcp --permanent
sudo firewall-cmd --reload
```

---

## 🔍 方法 7: 其他托管服务

### Render

1. 登录 Render 控制台
2. 选择你的 MySQL 数据库服务
3. 在 **Info** 页面查看连接信息
4. **Hostname** → DB_HOST
5. **Internal Database URL** 包含所有连接信息

### DigitalOcean

1. 登录 DigitalOcean 控制台
2. 进入 **Databases**
3. 选择你的 MySQL 数据库
4. 在 **Connection Details** 中查看：
   - **Host** → DB_HOST
   - **Port** → DB_PORT
   - **User** → DB_USER
   - **Password** → DB_PASSWORD
   - **Database** → DB_NAME

### Heroku (如果使用 Heroku Postgres + 转换)

Heroku 主要提供 PostgreSQL，如果需要 MySQL，可能需要使用第三方插件。

---

## 📝 通用检查方法

如果你不确定使用哪个服务，可以：

1. **检查你的服务提供商**
   - 查看你的数据库是在哪个平台创建的
   - 常见平台：PlanetScale, Supabase, Railway, Azure, AWS, Render, DigitalOcean

2. **查看服务文档**
   - 每个平台通常都有文档说明如何获取连接信息
   - 搜索 "平台名 + MySQL connection string"

3. **查看创建记录**
   - 如果刚创建数据库，创建时的邮件或页面通常包含连接信息
   - 检查你的邮箱或文档记录

---

## ✅ 验证连接信息

获取连接信息后，可以在本地测试连接：

### 使用命令行：

```bash
mysql -h 主机地址 -P 端口 -u 用户名 -p数据库名
```

输入密码后，如果成功连接，说明信息正确。

### 使用 Node.js 测试脚本：

创建 `test-connection.js`:

```javascript
require('dotenv').config()
const mysql = require('mysql2/promise')

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })
    console.log('✅ 连接成功！')
    await connection.end()
  } catch (error) {
    console.error('❌ 连接失败:', error.message)
  }
}

test()
```

运行：
```bash
node test-connection.js
```

---

## 🎯 快速查找表

| 服务 | 主机地址在哪里找 | 免费套餐 |
|------|----------------|---------|
| **Railway** | Service → Variables → MYSQLHOST | ✅ $5/月免费额度 |
| **Render** | Service → Info → Hostname | ✅ 免费套餐可用 |
| **db4free.net** | 固定为 `db4free.net` | ✅ 完全免费 |
| **Supabase** | Settings → Database → Connection string | ✅ 免费套餐（PostgreSQL） |
| **PlanetScale** | Connect 按钮 → MySQL 连接字符串 | ❌ 已取消免费套餐 |
| **Azure** | MySQL Server → Overview → Server name | ❌ 付费 |
| **AWS RDS** | RDS Console → Database → Endpoint | ❌ 付费 |
| **DigitalOcean** | Databases → Connection Details → Host | ❌ 付费 |
| **自建服务器** | 服务器的公网 IP 或域名 | - |

---

## ⚠️ 注意事项

1. **安全性**
   - 不要将数据库密码分享给他人
   - 使用环境变量存储敏感信息，不要硬编码在代码中

2. **网络访问**
   - 确保数据库允许外部连接（如果从 Vercel 访问）
   - 某些服务可能需要将 Vercel 的 IP 地址添加到白名单

3. **连接池**
   - 某些服务（如 PlanetScale）推荐使用连接池
   - 连接池的主机地址可能不同，查看服务文档

4. **SSL 连接**
   - 大多数托管服务要求使用 SSL 连接
   - 代码已自动处理 SSL（mysql2 包默认启用）

---

## 📞 需要帮助？

如果你仍然找不到连接信息：

1. **告诉我你使用的服务**
   - 我可以提供更具体的指导

2. **检查服务文档**
   - 每个服务的官方文档都有详细的连接说明

3. **联系服务支持**
   - 如果使用付费服务，可以联系技术支持

---

**下一步**: 获取到连接信息后，参考 [Vercel部署指南](./Vercel部署指南.md) 在 Vercel 中配置环境变量。

