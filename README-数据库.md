# 数据库配置快速开始

## 使用 MySQL 数据库

### 1. 安装 MySQL

根据您的操作系统安装 MySQL：
- **Windows**: [下载 MySQL Installer](https://dev.mysql.com/downloads/installer/)
- **macOS**: `brew install mysql && brew services start mysql`
- **Linux**: `sudo apt-get install mysql-server` 或 `sudo yum install mysql-server`

### 2. 创建数据库

连接到 MySQL 并创建数据库：

```bash
mysql -u root -p
```

然后执行：

```sql
CREATE DATABASE students_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. 配置环境变量

在项目根目录创建 `.env` 文件（如果还没有）：

```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=students_db
```

### 4. 启动应用

```bash
npm run dev
```

系统会自动：
- 连接到 MySQL 数据库
- 创建必要的表结构
- 初始化索引

### 5. 验证

查看控制台输出，应该看到：
```
使用 MySQL 数据库
数据库初始化完成
```

## 切换回 SQLite

只需在 `.env` 文件中修改：

```env
DB_TYPE=sqlite
DB_PATH=./data/students.db
```

或者删除 `.env` 文件（使用默认的 SQLite 配置）。

## 更多信息

详细配置说明请参考：[docs/数据库配置.md](./docs/数据库配置.md)

