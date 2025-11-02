import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { DatabaseAdapter } from './db-adapter'

export class SQLiteAdapter implements DatabaseAdapter {
  private db: Database.Database

  constructor(dbPath: string) {
    // 确保目录存在
    const dataDir = path.dirname(dbPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    this.db = new Database(dbPath)
    this.db.pragma('foreign_keys = ON')
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    try {
      const stmt = this.db.prepare(sql)
      const result = params ? stmt.get(...params) : stmt.get()
      return (result as T) || null
    } catch (error) {
      console.error('SQLite queryOne error:', error)
      throw error
    }
  }

  async queryAll<T = any>(sql: string, params?: any[]): Promise<T[]> {
    try {
      const stmt = this.db.prepare(sql)
      const result = params ? stmt.all(...params) : stmt.all()
      return (result as T[]) || []
    } catch (error) {
      console.error('SQLite queryAll error:', error)
      throw error
    }
  }

  async execute(sql: string, params?: any[]): Promise<{ lastInsertId?: number; affectedRows: number }> {
    try {
      const stmt = this.db.prepare(sql)
      const result = params ? stmt.run(...params) : stmt.run()
      return {
        lastInsertId: result.lastInsertRowid as number | undefined,
        affectedRows: result.changes
      }
    } catch (error) {
      console.error('SQLite execute error:', error)
      throw error
    }
  }

  async exec(sql: string): Promise<void> {
    try {
      this.db.exec(sql)
    } catch (error) {
      console.error('SQLite exec error:', error)
      throw error
    }
  }

  async beginTransaction(): Promise<void> {
    // SQLite 事务通过 transaction() 方法处理，这里不做操作
  }

  async commit(): Promise<void> {
    // SQLite 事务自动提交
  }

  async rollback(): Promise<void> {
    // SQLite 事务通过 try-catch 回滚
  }

  async close(): Promise<void> {
    this.db.close()
  }

  // SQLite 专用方法：创建事务函数
  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)()
  }

  // SQLite 专用同步方法（用于脚本）
  queryOneSync<T = any>(sql: string, params?: any[]): T | null {
    try {
      const stmt = this.db.prepare(sql)
      const result = params ? stmt.get(...params) : stmt.get()
      return (result as T) || null
    } catch (error) {
      console.error('SQLite queryOneSync error:', error)
      throw error
    }
  }

  queryAllSync<T = any>(sql: string, params?: any[]): T[] {
    try {
      const stmt = this.db.prepare(sql)
      const result = params ? stmt.all(...params) : stmt.all()
      return (result as T[]) || []
    } catch (error) {
      console.error('SQLite queryAllSync error:', error)
      throw error
    }
  }

  executeSync(sql: string, params?: any[]): { lastInsertId?: number; affectedRows: number } {
    try {
      const stmt = this.db.prepare(sql)
      const result = params ? stmt.run(...params) : stmt.run()
      return {
        lastInsertId: result.lastInsertRowid as number | undefined,
        affectedRows: result.changes
      }
    } catch (error) {
      console.error('SQLite executeSync error:', error)
      throw error
    }
  }
}

