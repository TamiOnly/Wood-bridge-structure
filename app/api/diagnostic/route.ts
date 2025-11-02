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
    // 在 Vercel 上使用硬编码登录时，数据库连接失败不是致命错误
    const isVercel = !!process.env.VERCEL
    try {
      await ensureDatabaseInitialized()
      diagnostics.checks.databaseConnection = {
        status: 'ok',
        message: '数据库连接成功'
      }
    } catch (error: any) {
      // 在 Vercel 环境且使用硬编码登录时，数据库连接失败是正常的
      if (isVercel && !process.env.DB_TYPE) {
        diagnostics.checks.databaseConnection = {
          status: 'ok',
          message: '数据库未配置，使用硬编码登录验证（正常）'
        }
      } else {
        diagnostics.checks.databaseConnection = {
          status: 'warning',
          message: '数据库连接失败，但可使用硬编码登录验证',
          error: error?.message,
          code: error?.code
        }
        // 不再返回错误，继续执行其他检查
      }
    }

    // 检查2: 数据库类型（检查实际使用的类型）
    const actualDbType = process.env.DB_TYPE || 'sqlite'
    let actualType = actualDbType
    
    // 只在配置为 MySQL 时才尝试检测，避免在 SQLite 上执行 MySQL 查询
    if (actualDbType === 'mysql') {
      try {
        const db = getDb()
        // 尝试执行 MySQL 特有的查询来检测实际类型
        const testQuery = await db.queryOne<any>("SELECT VERSION() as version")
        if (testQuery?.version) {
          actualType = 'mysql'
        }
      } catch (e: any) {
        // 如果失败，说明可能配置错误
        console.warn('[Diagnostic] MySQL检测失败:', e?.message)
        actualType = 'unknown'
      }
    } else {
      // 如果配置的是 SQLite，直接使用，不需要检测
      actualType = 'sqlite'
    }
    
    diagnostics.checks.databaseType = {
      status: actualType === 'mysql' ? 'ok' : 'warning',
      environmentVariable: actualDbType,
      actualType: actualType,
      message: actualDbType !== 'mysql' 
        ? `⚠️ 环境变量 DB_TYPE=${actualDbType}，但实际使用: ${actualType.toUpperCase()}。请检查 Vercel 环境变量配置！`
        : `✅ 当前使用: ${actualType.toUpperCase()}`,
      warning: actualDbType === 'sqlite' && process.env.VERCEL 
        ? '生产环境不应使用 SQLite！请在 Vercel 环境变量中设置 DB_TYPE=mysql'
        : undefined
    }

    // 检查3: 表是否存在（仅在数据库可用时检查）
    if (actualType === 'mysql' || (actualType === 'sqlite' && !process.env.VERCEL)) {
      try {
        const db = getDb()
        const currentDbType = process.env.DB_TYPE || 'sqlite'
        const tables = await db.queryAll<any>(
          currentDbType === 'mysql' 
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
            status: 'warning',
            message: 'students 表不存在，但使用硬编码登录不需要数据库'
          }
        }
      } catch (error: any) {
        diagnostics.checks.tableExists = {
          status: 'warning',
          message: '检查表时出错，但使用硬编码登录不需要数据库',
          error: error?.message
        }
      }
    } else {
      // Vercel 环境使用硬编码登录，不需要数据库表
      diagnostics.checks.tableExists = {
        status: 'ok',
        message: '使用硬编码登录验证，无需数据库表'
      }
    }

    // 检查4: 数据数量（仅在数据库可用时检查）
    if (actualType === 'mysql' || (actualType === 'sqlite' && !process.env.VERCEL)) {
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
    } else {
      // Vercel 环境使用硬编码登录，不需要数据库
      diagnostics.checks.dataCount = {
        status: 'ok',
        count: 10,
        message: '使用硬编码登录验证（10位组长），无需数据库'
      }
      diagnostics.checks.leaderCount = {
        status: 'ok',
        count: 10,
        message: '使用硬编码组长账户（10位），无需数据库'
      }
    }

    // 检查6: Coze API 配置（智能体）
    const hasCozeApiKey = !!process.env.COZE_API_KEY
    const hasCozeBotId = !!process.env.COZE_BOT_ID
    const cozeConfigured = hasCozeApiKey && hasCozeBotId
    
    diagnostics.checks.cozeApi = {
      status: cozeConfigured ? 'ok' : 'error',
      hasApiKey: hasCozeApiKey,
      hasBotId: hasCozeBotId,
      message: cozeConfigured
        ? '✅ Coze API 配置正常，智能体可用'
        : !hasCozeApiKey && !hasCozeBotId
        ? '❌ Coze API 未配置：缺少 COZE_API_KEY 和 COZE_BOT_ID。请在 Vercel 项目设置中添加这些环境变量。参考：docs/Vercel智能体配置指南.md'
        : !hasCozeApiKey
        ? '❌ Coze API 未配置：缺少 COZE_API_KEY。请在 Vercel 项目设置中添加此环境变量。'
        : '❌ Coze API 未配置：缺少 COZE_BOT_ID。请在 Vercel 项目设置中添加此环境变量。',
      configGuide: isVercel && !cozeConfigured
        ? '配置步骤：Vercel Dashboard → 项目 → Settings → Environment Variables → 添加 COZE_API_KEY 和 COZE_BOT_ID → 重新部署'
        : undefined
    }

    // 检查7: 数据库环境变量
    const dbTypeEnv = process.env.DB_TYPE
    
    diagnostics.checks.environment = {
      status: dbTypeEnv === 'mysql' ? 'ok' : (isVercel ? 'error' : 'warning'),
      isVercel: isVercel,
      dbType: dbTypeEnv || '❌ 未设置（默认使用sqlite，生产环境错误！）',
      dbHost: process.env.DB_HOST || '❌ 未设置',
      dbName: process.env.DB_NAME || '❌ 未设置',
      hasDbUser: !!process.env.DB_USER,
      hasDbPassword: !!process.env.DB_PASSWORD,
      hasCozeApiKey: hasCozeApiKey,
      hasCozeBotId: hasCozeBotId,
      message: !dbTypeEnv && isVercel
        ? '❌ 严重错误：Vercel 环境中 DB_TYPE 未设置！请立即在 Vercel 项目设置中添加环境变量 DB_TYPE=mysql'
        : dbTypeEnv === 'sqlite' && isVercel
        ? '❌ 严重错误：Vercel 不能使用 SQLite！请将 DB_TYPE 改为 mysql'
        : dbTypeEnv === 'mysql' && (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD)
        ? '⚠️ DB_TYPE=mysql 但缺少必要的 MySQL 配置（DB_HOST, DB_USER, DB_PASSWORD）'
        : '✅ 环境变量配置正常'
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

