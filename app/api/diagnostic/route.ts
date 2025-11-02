import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { ensureDatabaseInitialized } from '@/lib/db'

export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    status: 'checking',
    checks: {}
  }

  try {
    // 检查1: 数据库连接
    try {
      await ensureDatabaseInitialized()
      diagnostics.checks.databaseConnection = {
        status: 'ok',
        message: '数据库连接成功'
      }
    } catch (error: any) {
      diagnostics.checks.databaseConnection = {
        status: 'error',
        message: '数据库连接失败',
        error: error?.message,
        code: error?.code
      }
      diagnostics.status = 'error'
      return NextResponse.json(diagnostics, { status: 500 })
    }

    // 检查2: 数据库类型
    const dbType = process.env.DB_TYPE || 'sqlite'
    diagnostics.checks.databaseType = {
      status: 'ok',
      type: dbType,
      message: `当前使用: ${dbType.toUpperCase()}`
    }

    // 检查3: 表是否存在
    try {
      const db = getDb()
      const tables = await db.queryAll<any>(
        dbType === 'mysql' 
          ? "SHOW TABLES LIKE 'students'"
          : "SELECT name FROM sqlite_master WHERE type='table' AND name='students'"
      )
      
      if (tables.length > 0) {
        diagnostics.checks.tableExists = {
          status: 'ok',
          message: 'students 表已存在'
        }
      } else {
        diagnostics.checks.tableExists = {
          status: 'error',
          message: 'students 表不存在，需要初始化'
        }
        diagnostics.status = 'warning'
      }
    } catch (error: any) {
      diagnostics.checks.tableExists = {
        status: 'error',
        message: '检查表时出错',
        error: error?.message
      }
    }

    // 检查4: 数据数量
    try {
      const db = getDb()
      const countResult = await db.queryOne<{ count: number }>(
        'SELECT COUNT(*) as count FROM students'
      )
      const studentCount = countResult?.count || 0
      
      diagnostics.checks.dataCount = {
        status: studentCount > 0 ? 'ok' : 'warning',
        count: studentCount,
        message: studentCount > 0 
          ? `数据库中有 ${studentCount} 条学生记录` 
          : '数据库中没有任何学生记录，需要导入数据'
      }
      
      if (studentCount === 0) {
        diagnostics.status = 'warning'
      }

      // 检查5: 组长数量
      const leaderResult = await db.queryOne<{ count: number }>(
        "SELECT COUNT(*) as count FROM students WHERE role = '组长'"
      )
      const leaderCount = leaderResult?.count || 0
      
      diagnostics.checks.leaderCount = {
        status: leaderCount > 0 ? 'ok' : 'warning',
        count: leaderCount,
        message: leaderCount > 0 
          ? `数据库中有 ${leaderCount} 个组长账户` 
          : '数据库中没有组长账户，无法登录'
      }
      
      if (leaderCount === 0) {
        diagnostics.status = 'warning'
      }

    } catch (error: any) {
      diagnostics.checks.dataCount = {
        status: 'error',
        message: '查询数据时出错',
        error: error?.message,
        code: error?.code
      }
    }

    // 检查6: 环境变量
    diagnostics.checks.environment = {
      status: 'info',
      dbType: process.env.DB_TYPE || '未设置（默认sqlite）',
      dbHost: process.env.DB_HOST || '未设置',
      dbName: process.env.DB_NAME || '未设置',
      hasDbUser: !!process.env.DB_USER,
      hasDbPassword: !!process.env.DB_PASSWORD,
      hasCozeApiKey: !!process.env.COZE_API_KEY,
      hasCozeBotId: !!process.env.COZE_BOT_ID
    }

    if (diagnostics.status === 'checking') {
      diagnostics.status = 'ok'
    }

    return NextResponse.json(diagnostics, { status: 200 })

  } catch (error: any) {
    diagnostics.status = 'error'
    diagnostics.error = {
      message: error?.message,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }
    return NextResponse.json(diagnostics, { status: 500 })
  }
}

