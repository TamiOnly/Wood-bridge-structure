# 如何获取 MySQL 主机地址和连接信息

根据你使用的 MySQL 服务，获取连接信息的方法不同。以下是常见服务的详细说明：

## 🔍 方法 1: PlanetScale（推荐）

PlanetScale 是一个流行的 MySQL 托管服务，提供免费套餐。

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
   从连接字符串中提取：
   - **DB_HOST**: 主机地址（例如：`aws.connect.psdb.cloud`）
   - **DB_PORT**: `3306`
   - **DB_USER**: 用户名
   - **DB_PASSWORD**: 密码（点击显示）
   - **DB_NAME**: 数据库名

### 示例：

如果连接字符串是：
```
mysql://abc123:pscale_pw_xxx@aws.connect.psdb.cloud:3306/my_database
```

那么：
- **DB_HOST** = `aws.connect.psdb.cloud`
- **DB_PORT** = `3306`
- **DB_USER** = `abc123`
- **DB_PASSWORD** = `pscale_pw_xxx`
- **DB_NAME** = `my_database`

---

## 🔍 方法 2: Supabase

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

| 服务 | 主机地址在哪里找 |
|------|----------------|
| **PlanetScale** | Connect 按钮 → MySQL 连接字符串 |
| **Supabase** | Settings → Database → Connection string |
| **Railway** | Service → Variables → MYSQLHOST |
| **Azure** | MySQL Server → Overview → Server name |
| **AWS RDS** | RDS Console → Database → Endpoint |
| **Render** | Service → Info → Hostname |
| **DigitalOcean** | Databases → Connection Details → Host |
| **自建服务器** | 服务器的公网 IP 或域名 |

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

