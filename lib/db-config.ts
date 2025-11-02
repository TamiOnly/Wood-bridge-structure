// 数据库配置
export interface DatabaseConfig {
  type: 'sqlite' | 'mysql'
  sqlite?: {
    path: string
  }
  mysql?: {
    host: string
    port: number
    user: string
    password: string
    database: string
    connectionLimit?: number
    waitForConnections?: boolean
    queueLimit?: number
  }
}

// 从环境变量读取数据库配置
export function getDatabaseConfig(): DatabaseConfig {
  const dbType = (process.env.DB_TYPE || 'sqlite').toLowerCase()

  if (dbType === 'mysql') {
    return {
      type: 'mysql',
      mysql: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'students_db',
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
        waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS !== 'false',
        queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '0'),
      }
    }
  }

  // 默认使用 SQLite
  return {
    type: 'sqlite',
    sqlite: {
      path: process.env.DB_PATH || './data/students.db'
    }
  }
}

