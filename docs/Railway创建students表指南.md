# Railway 创建 students 表指南

## 方法 1: 使用 SQL 直接创建（推荐）

如果你已经在 Railway 中创建了 MySQL 数据库，最好的方式是直接执行 SQL 创建表。

### 步骤 1: 获取连接信息

1. 在 Railway MySQL 服务中，点击 **"Connect"** 按钮
2. 复制连接字符串，或者使用 Variables 标签中的信息

### 步骤 2: 使用 MySQL 客户端连接

你可以使用以下任一方式：

#### 选项 A: 使用 MySQL Workbench（图形界面，推荐）

1. 打开 MySQL Workbench
2. 点击 **"+"** 创建新连接
3. 填入 Railway 提供的连接信息：
   - **Connection Name**: Railway MySQL
   - **Hostname**: `MYSQLHOST` 的值
   - **Port**: `3306`（或 `MYSQLPORT` 的值）
   - **Username**: `MYSQLUSER` 的值
   - **Password**: `MYSQLPASSWORD` 的值
4. 点击 **"Test Connection"** 测试连接
5. 连接成功后，在 SQL 编辑器中执行以下 SQL：

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

#### 选项 B: 使用命令行

```bash
mysql -h <Railway的MYSQLHOST> -P 3306 -u <Railway的MYSQLUSER> -p<MYSQLPASSWORD> <Railway的MYSQLDATABASE>
```

⚠️ **注意**: 
- `-p` 和密码之间**不能有空格**
- 或者使用 `-p` 不跟密码，系统会提示你输入密码（更安全）

然后在 MySQL 命令行中执行上面的 SQL。

#### 选项 C: 使用项目中的脚本

如果你有本地的 MySQL 连接工具，可以：

1. 在项目根目录创建 `.env` 文件（临时，不要提交到 Git）：
```env
DB_TYPE=mysql
DB_HOST=<Railway的MYSQLHOST>
DB_PORT=3306
DB_USER=<Railway的MYSQLUSER>
DB_PASSWORD=<Railway的MYSQLPASSWORD>
DB_NAME=<Railway的MYSQLDATABASE>
```

2. 运行创建表的脚本：
```bash
node scripts/create-students-table.js
```

## 方法 2: 让应用自动创建（最简单）

**实际上，你不需要手动创建表！**

应用会在首次访问时自动创建表。只需：

1. ✅ 确保在 Vercel 中配置了正确的环境变量
2. ✅ 部署应用
3. ✅ 访问应用（任何页面都可以）
4. ✅ 应用会自动创建 `students` 表

### 验证表是否创建

访问诊断端点：
```
https://你的域名.vercel.app/api/diagnostic
```

查看 `tableExists` 部分，应该显示 "students 表已存在"。

## 完整的 SQL 建表语句

如果你需要手动创建，完整的 SQL 如下：

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

## 表结构说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INT AUTO_INCREMENT | 主键，自动递增 |
| `name` | VARCHAR(100) | 学生姓名 |
| `grade` | VARCHAR(50) | 年级 |
| `studentId` | VARCHAR(50) UNIQUE | 学号（唯一） |
| `gender` | ENUM('男', '女') | 性别 |
| `role` | ENUM('组长', '组员') | 角色 |
| `groupName` | VARCHAR(100) | 组名 |
| `groupPassword` | VARCHAR(100) | 组密码 |
| `createdAt` | DATETIME | 创建时间 |
| `updatedAt` | DATETIME | 更新时间 |

## 关于 Railway 的图形界面

Railway 的图形界面（Database 标签）创建表功能可能不支持复杂的 ENUM 类型和索引。建议：

1. ✅ **使用 SQL 直接执行**（推荐）
2. ✅ **或者让应用自动创建**（最简单）

## 下一步

创建表后：

1. ✅ 验证表是否创建成功
2. ✅ 导入测试数据（可选）
3. ✅ 测试登录功能

