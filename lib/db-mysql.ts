import mysql from 'mysql2/promise'
import { DatabaseAdapter } from './db-adapter'

interface MySQLConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  connectionLimit?: number
  waitForConnections?: boolean
  queueLimit?: number
}

export class MySQLAdapter implements DatabaseAdapter {
  private pool: mysql.Pool
  private connection: mysql.PoolConnection | null = null

  constructor(config: MySQLConfig) {
    this.pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: config.connectionLimit || 10,
      waitForConnections: config.waitForConnections !== false,
      queueLimit: config.queueLimit || 0,
      charset: 'utf8mb4',
      timezone: '+00:00'
    })
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    try {
      const [rows] = await this.pool.execute(sql, params || [])
      const result = rows as any[]
      return result.length > 0 ? (result[0] as T) : null
    } catch (error) {
      console.error('MySQL queryOne error:', error)
      throw error
    }
  }

  async queryAll<T = any>(sql: string, params?: any[]): Promise<T[]> {
    try {
      const [rows] = await this.pool.execute(sql, params || [])
      return (rows as T[]) || []
    } catch (error) {
      console.error('MySQL queryAll error:', error)
      throw error
    }
  }

  async execute(sql: string, params?: any[]): Promise<{ lastInsertId?: number; affectedRows: number }> {
    try {
      const [result] = await this.pool.execute(sql, params || []) as any
      return {
        lastInsertId: result.insertId,
        affectedRows: result.affectedRows
      }
    } catch (error) {
      console.error('MySQL execute error:', error)
      throw error
    }
  }

  async exec(sql: string): Promise<void> {
    try {
      // MySQL 需要按分号分割多条SQL语句
      const statements = sql.split(';').filter(s => s.trim())
      for (const statement of statements) {
        if (statement.trim()) {
          await this.pool.execute(statement)
        }
      }
    } catch (error) {
      console.error('MySQL exec error:', error)
      throw error
    }
  }

  async beginTransaction(): Promise<void> {
    if (!this.connection) {
      this.connection = await this.pool.getConnection()
    }
    await this.connection.beginTransaction()
  }

  async commit(): Promise<void> {
    if (this.connection) {
      await this.connection.commit()
      this.connection.release()
      this.connection = null
    }
  }

  async rollback(): Promise<void> {
    if (this.connection) {
      await this.connection.rollback()
      this.connection.release()
      this.connection = null
    }
  }

  async close(): Promise<void> {
    await this.pool.end()
  }

  // MySQL 专用方法：获取连接池
  getPool(): mysql.Pool {
    return this.pool
  }
}

