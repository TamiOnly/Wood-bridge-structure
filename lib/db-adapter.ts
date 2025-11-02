// 数据库适配器接口
export interface DatabaseAdapter {
  // 执行查询，返回单行结果
  queryOne<T = any>(sql: string, params?: any[]): Promise<T | null>
  
  // 执行查询，返回多行结果
  queryAll<T = any>(sql: string, params?: any[]): Promise<T[]>
  
  // 执行更新/插入/删除操作
  execute(sql: string, params?: any[]): Promise<{ lastInsertId?: number; affectedRows: number }>
  
  // 执行多条SQL语句（用于建表等）
  exec(sql: string): Promise<void>
  
  // 开始事务
  beginTransaction(): Promise<void>
  
  // 提交事务
  commit(): Promise<void>
  
  // 回滚事务
  rollback(): Promise<void>
  
  // 关闭连接
  close(): Promise<void>
}

