# MySQL 数据库设置指南

## 步骤 1: 启动 MySQL 服务

### Windows
1. 打开"服务"管理器（Win+R，输入 `services.msc`）
2. 找到 "MySQL" 服务
3. 右键选择"启动"（如果未运行）

或者使用命令：
```bash
net start MySQL
```

### macOS/Linux
```bash
sudo service mysql start
# 或
sudo systemctl start mysql
```

## 步骤 2: 创建数据库

### 方法 A: 使用命令行

打开命令提示符（Windows）或终端，运行：

```bash
mysql -u root -p
```

然后输入您的 MySQL root 密码。

在 MySQL 命令行中执行：

```sql
CREATE DATABASE students_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 方法 B: 使用 MySQL Workbench 或其他图形工具

1. 打开 MySQL Workbench
2. 连接到本地 MySQL 服务器
3. 执行以下 SQL：
```sql
CREATE DATABASE students_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 步骤 3: 创建 .env 配置文件

在项目根目录创建 `.env` 文件，内容如下：

```env
# 数据库类型：mysql
DB_TYPE=mysql

# MySQL 配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=您的MySQL密码
DB_NAME=students_db
DB_CONNECTION_LIMIT=10
DB_WAIT_FOR_CONNECTIONS=true
DB_QUEUE_LIMIT=0
```

**重要**: 将 `DB_PASSWORD=您的MySQL密码` 中的"您的MySQL密码"替换为您的实际 MySQL root 密码。

## 步骤 4: 验证配置

运行以下命令测试连接：

```bash
node -e "require('dotenv').config(); const mysql = require('mysql2/promise'); (async () => { try { const conn = await mysql.createConnection({ host: process.env.DB_HOST, port: process.env.DB_PORT, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME }); console.log('✓ MySQL 连接成功!'); await conn.end(); } catch(e) { console.error('✗ 连接失败:', e.message); } })()"
```

如果看到 "✓ MySQL 连接成功!"，说明配置正确。

## 步骤 5: 启动应用

```bash
npm run dev
```

系统会自动：
- 连接到 MySQL 数据库
- 创建 `students` 表
- 创建必要的索引

查看控制台输出，应该看到：
```
使用 MySQL 数据库
数据库初始化完成
```

## 常见问题

### Q: 忘记了 MySQL root 密码怎么办？

**Windows:**
1. 停止 MySQL 服务
2. 使用 `--skip-grant-tables` 启动 MySQL
3. 重置密码后重启服务

**macOS/Linux:**
```bash
sudo mysql_secure_installation
```

### Q: 连接被拒绝怎么办？

1. 检查 MySQL 服务是否正在运行
2. 检查端口是否正确（默认 3306）
3. 检查防火墙设置

### Q: 密码包含特殊字符怎么办？

在 `.env` 文件中，如果密码包含特殊字符，用引号包裹：
```env
DB_PASSWORD="my@password#123"
```

### Q: 如何测试数据库连接？

可以运行我创建的测试脚本：
```bash
node scripts/setup-mysql.js
```

## 下一步

配置完成后，您可以：
1. 使用 API 添加学生数据
2. 使用批量导入功能导入大量数据
3. 使用登录功能测试系统

## 需要帮助？

如果遇到问题，请检查：
- MySQL 服务是否运行
- 数据库名称是否正确
- 用户名和密码是否正确
- 端口号是否正确

