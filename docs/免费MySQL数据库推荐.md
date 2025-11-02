# 免费 MySQL 数据库服务推荐

由于 PlanetScale 已于 2024 年 4 月取消免费套餐，以下是推荐的免费或低成本的 MySQL 数据库替代方案：

## 🎯 推荐方案（按推荐顺序）

### 1. Railway（最推荐）⭐

- **免费额度**: $5/月免费额度
- **优点**: 
  - 使用简单，自动配置
  - 每月 $5 免费额度足够小型项目使用
  - 支持多种数据库
  - 与 GitHub 集成良好
- **缺点**: 超出免费额度需要付费
- **适用场景**: 中小型项目，测试环境
- **获取连接信息**: [如何获取MySQL连接信息.md](./如何获取MySQL连接信息.md#方法-1-railway推荐免费额度-5月)

### 2. Render（推荐）⭐

- **免费套餐**: 有免费 PostgreSQL/MySQL（有限制）
- **优点**:
  - 完全免费（有限制）
  - 简单易用
  - 自动备份
- **缺点**: 
  - 免费套餐有资源限制
  - 90 天不使用会暂停
- **适用场景**: 测试项目，演示项目
- **获取连接信息**: 参考 Render 文档

### 3. db4free.net（完全免费）

- **免费套餐**: 完全免费
- **优点**:
  - 真正的免费，无限制
  - 适合学习和测试
- **缺点**:
  - 性能和稳定性有限
  - 可能有使用限制
  - 不适合生产环境
- **适用场景**: 学习、测试、开发
- **连接信息**: 
  - Host: `db4free.net`
  - Port: `3306`

### 4. Supabase（PostgreSQL，但功能类似）

- **免费套餐**: 免费 PostgreSQL 数据库
- **优点**:
  - 功能强大
  - 免费套餐慷慨
  - 类似 MySQL 的使用体验
- **缺点**: 
  - 是 PostgreSQL 不是 MySQL
  - 需要修改代码适配（如果当前代码是 MySQL 专用）
- **适用场景**: 新项目，可以接受 PostgreSQL

## 📊 对比表

| 服务 | 免费额度 | 数据库类型 | 推荐度 | 适合场景 |
|------|---------|-----------|--------|---------|
| **Railway** | $5/月 | MySQL | ⭐⭐⭐⭐⭐ | 生产/测试 |
| **Render** | 免费（有限制） | MySQL/PostgreSQL | ⭐⭐⭐⭐ | 测试/演示 |
| **db4free.net** | 完全免费 | MySQL | ⭐⭐⭐ | 学习/测试 |
| **Supabase** | 免费 | PostgreSQL | ⭐⭐⭐⭐ | 新项目 |
| ~~PlanetScale~~ | ~~已取消~~ | MySQL | - | - |

## 🚀 快速开始

### 使用 Railway（推荐）

1. **注册账号**
   ```
   访问: https://railway.app
   使用 GitHub 账号登录
   ```

2. **创建数据库**
   - 点击 "New Project"
   - 选择 "Database" → "MySQL"
   - Railway 自动创建并配置

3. **获取连接信息**
   - 点击 MySQL 服务
   - 查看 Variables 标签
   - 复制所有连接信息

4. **配置到 Vercel**
   - 在 Vercel 环境变量中添加：
     ```
     DB_TYPE=mysql
     DB_HOST=<从 Railway Variables 复制>
     DB_PORT=3306
     DB_USER=<从 Railway Variables 复制>
     DB_PASSWORD=<从 Railway Variables 复制>
     DB_NAME=<从 Railway Variables 复制>
     ```

### 使用 Render

1. **注册账号**: https://render.com
2. **创建 MySQL 数据库**: New → Database → MySQL
3. **获取连接信息**: 在数据库详情页面
4. **配置到 Vercel**: 同 Railway 步骤

### 使用 db4free.net

1. **注册账号**: https://www.db4free.net
2. **创建数据库**: 登录后创建新数据库
3. **连接信息**:
   ```
   DB_HOST=db4free.net
   DB_PORT=3306
   DB_USER=<你注册的用户名>
   DB_PASSWORD=<你设置的密码>
   DB_NAME=<你创建的数据库名>
   ```

## ⚠️ 注意事项

1. **生产环境建议**
   - 生产环境建议使用付费服务或自建服务器
   - 免费服务通常有性能和稳定性限制

2. **数据安全**
   - 定期备份数据
   - 不要存储敏感生产数据在免费服务上

3. **性能考虑**
   - 免费服务可能有连接数限制
   - 查询性能可能不如付费服务

4. **服务稳定性**
   - 免费服务可能随时变更政策
   - 建议准备备选方案

## 🔄 迁移指南

如果你之前使用 PlanetScale，需要迁移到新服务：

1. **导出数据**
   ```bash
   mysqldump -h 旧主机 -u 用户名 -p 数据库名 > backup.sql
   ```

2. **在新服务创建数据库**

3. **导入数据**
   ```bash
   mysql -h 新主机 -u 用户名 -p 数据库名 < backup.sql
   ```

4. **更新 Vercel 环境变量**

5. **测试连接**

## 📚 相关文档

- [如何获取MySQL连接信息](./如何获取MySQL连接信息.md)
- [Vercel部署指南](./Vercel部署指南.md)
- [数据库配置指南](./数据库配置.md)

## 💡 建议

对于本项目（学生数据库管理），建议：

- **学习/测试**: 使用 db4free.net 或 Render
- **小型项目**: 使用 Railway（$5/月免费额度）
- **生产环境**: 使用付费服务或自建服务器

---

**更新日期**: 2024年（PlanetScale 取消免费套餐后）

