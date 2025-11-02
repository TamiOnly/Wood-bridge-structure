# MySQL 命令行连接说明

## 命令格式说明

```bash
mysql -h <主机地址> -P <端口> -u <用户名> -p<密码> <数据库名>
```

## 各部分含义

### `mysql`
- MySQL 客户端命令
- 用于连接到 MySQL 数据库

### `-h <主机地址>`
- `-h` 参数指定 MySQL 服务器的主机地址
- `<主机地址>` 替换为实际的主机地址
- 例如：`-h containers-us-west-xxx.railway.app`

### `-P <端口>`
- `-P` 参数指定 MySQL 服务器的端口号
- `<端口>` 替换为实际的端口号
- 例如：`-P 3306`（MySQL 默认端口）
- ⚠️ **注意**：`-P` 是大写，如果是 `-p`（小写）是密码参数

### `-u <用户名>`
- `-u` 参数指定登录用户名
- `<用户名>` 替换为实际的用户名
- 例如：`-u root`

### `-p<密码>`
- `-p` 参数用于指定密码
- ⚠️ **重要**：`-p` 和密码之间**不能有空格**
- 例如：`-pMyPassword123`
- **更安全的做法**：只写 `-p`（不跟密码），系统会提示你输入密码，这样密码不会显示在命令历史中

### `<数据库名>`
- 要连接的数据库名称
- 例如：`railway`

## 实际示例

### Railway MySQL 连接示例

假设 Railway Variables 中的值是：
- `MYSQLHOST=containers-us-west-123.railway.app`
- `MYSQLPORT=3306`
- `MYSQLUSER=root`
- `MYSQLPASSWORD=abc123xyz`
- `MYSQLDATABASE=railway`

那么完整的命令是：

```bash
mysql -h containers-us-west-123.railway.app -P 3306 -u root -pabc123xyz railway
```

### 更安全的连接方式（推荐）

为了安全，建议使用交互式密码输入：

```bash
mysql -h containers-us-west-123.railway.app -P 3306 -u root -p railway
```

执行后会提示：
```
Enter password: 
```

输入密码时不会显示字符，更安全。

## Windows PowerShell 中的注意事项

在 Windows PowerShell 中，如果密码包含特殊字符，可能需要用引号：

```powershell
mysql -h containers-us-west-123.railway.app -P 3306 -u root -p"abc123xyz" railway
```

或者使用交互式输入（更推荐）：

```powershell
mysql -h containers-us-west-123.railway.app -P 3306 -u root -p railway
```

## 连接成功后

连接成功后，你会看到 MySQL 提示符：

```
mysql> 
```

然后可以执行 SQL 命令，例如：

```sql
SHOW TABLES;
CREATE TABLE ...;
SELECT * FROM students;
```

退出 MySQL：输入 `exit` 或 `\q`

## 完整示例流程

### 1. 连接数据库

```bash
mysql -h containers-us-west-123.railway.app -P 3306 -u root -p railway
Enter password: ********
```

### 2. 查看现有表

```sql
mysql> SHOW TABLES;
```

### 3. 创建 students 表

```sql
mysql> CREATE TABLE IF NOT EXISTS students (
    ->   id INT AUTO_INCREMENT PRIMARY KEY,
    ->   name VARCHAR(100) NOT NULL,
    ->   grade VARCHAR(50) NOT NULL,
    ->   studentId VARCHAR(50) NOT NULL UNIQUE,
    ->   gender ENUM('男', '女') NOT NULL,
    ->   role ENUM('组长', '组员') NOT NULL,
    ->   groupName VARCHAR(100) NOT NULL,
    ->   groupPassword VARCHAR(100) NOT NULL,
    ->   createdAt DATETIME,
    ->   updatedAt DATETIME,
    ->   INDEX idx_studentId (studentId),
    ->   INDEX idx_groupName (groupName),
    ->   INDEX idx_role (role),
    ->   INDEX idx_name_group (name, groupName)
    -> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
Query OK, 0 rows affected (0.05 sec)
```

### 4. 验证表创建成功

```sql
mysql> SHOW TABLES;
+-------------------+
| Tables_in_railway |
+-------------------+
| students          |
+-------------------+
1 row in set (0.00 sec)
```

### 5. 查看表结构

```sql
mysql> DESCRIBE students;
```

### 6. 退出

```sql
mysql> exit
Bye
```

## 常见错误

### 错误 1: `-bash: mysql: command not found`

**原因**: 系统未安装 MySQL 客户端

**解决**: 
- Windows: 安装 MySQL 时需要选择安装 MySQL Client
- macOS: `brew install mysql-client`
- Linux: `sudo apt-get install mysql-client`

### 错误 2: `Access denied for user`

**原因**: 用户名或密码错误

**解决**: 检查 Railway Variables 中的 `MYSQLUSER` 和 `MYSQLPASSWORD` 是否正确

### 错误 3: `Can't connect to MySQL server`

**原因**: 
- 主机地址错误
- 端口号错误
- 网络连接问题

**解决**: 
- 检查 Railway Variables 中的 `MYSQLHOST` 和 `MYSQLPORT`
- 确认能访问互联网

### 错误 4: `Unknown database`

**原因**: 数据库名错误

**解决**: 检查 Railway Variables 中的 `MYSQLDATABASE` 是否正确

## 总结

命令格式：
```bash
mysql -h 主机地址 -P 端口 -u 用户名 -p密码 数据库名
```

关键点：
- `-p` 和密码之间**不能有空格**
- 更安全的方式：使用 `-p` 然后交互式输入密码
- 在 Windows PowerShell 中，包含特殊字符的密码可能需要引号

