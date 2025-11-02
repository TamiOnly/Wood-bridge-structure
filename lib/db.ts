import { getDatabaseConfig } from './db-config'
import { MySQLAdapter } from './db-mysql'
import { DatabaseAdapter } from './db-adapter'

let dbAdapter: DatabaseAdapter | null = null

// 初始化数据库适配器
export function initDatabaseAdapter(): DatabaseAdapter {
  if (dbAdapter) {
    return dbAdapter
  }

  const config = getDatabaseConfig()

  if (config.type === 'mysql' && config.mysql) {
    console.log('使用 MySQL 数据库')
    dbAdapter = new MySQLAdapter(config.mysql)
  } else {
    // 动态导入 SQLite 适配器，避免在 Vercel 构建时加载 native 模块
    console.log('使用 SQLite 数据库')
    try {
      // 使用动态导入，只在需要时加载 SQLite
      const { SQLiteAdapter } = require('./db-sqlite')
      const sqlitePath = config.sqlite?.path || './data/students.db'
      dbAdapter = new SQLiteAdapter(sqlitePath)
    } catch (error: any) {
      console.error('SQLite 初始化失败:', error.message)
      throw new Error('SQLite 数据库初始化失败。在生产环境请使用 MySQL 数据库。')
    }
  }

  if (!dbAdapter) {
    throw new Error('数据库适配器初始化失败')
  }

  return dbAdapter
}

// 获取数据库适配器实例
export function getDb(): DatabaseAdapter {
  if (!dbAdapter) {
    return initDatabaseAdapter()
  }
  return dbAdapter
}

// 初始化数据库表结构
export async function initDatabase() {
  const db = getDb()
  
  // SQLite 和 MySQL 的建表语句略有不同
  const isMySQL = process.env.DB_TYPE?.toLowerCase() === 'mysql'
  
  if (isMySQL) {
    // MySQL 建表语句（兼容 MySQL 5.5）
    // 注意：MySQL 5.5 限制一个表只能有一个 TIMESTAMP 字段使用 CURRENT_TIMESTAMP
    // 因此使用 DATETIME 类型，时间戳由应用层处理
    await db.exec(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
  } else {
    // SQLite 建表语句
    await db.exec(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        grade TEXT NOT NULL,
        studentId TEXT NOT NULL UNIQUE,
        gender TEXT NOT NULL CHECK(gender IN ('男', '女')),
        role TEXT NOT NULL CHECK(role IN ('组长', '组员')),
        groupName TEXT NOT NULL,
        groupPassword TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // SQLite 索引
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_studentId ON students(studentId);
      CREATE INDEX IF NOT EXISTS idx_groupName ON students(groupName);
      CREATE INDEX IF NOT EXISTS idx_role ON students(role);
      CREATE INDEX IF NOT EXISTS idx_name_group ON students(name, groupName);
    `)
  }

  console.log('数据库初始化完成')
}

// 初始化标志，避免重复初始化
let initialized = false

// 确保数据库已初始化（延迟初始化）
export async function ensureDatabaseInitialized() {
  if (initialized) {
    return
  }
  
  try {
    await initDatabase()
    initialized = true
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// 为了向后兼容，导出默认的适配器实例
export default getDb()
