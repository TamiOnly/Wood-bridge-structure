import { NextRequest, NextResponse } from 'next/server'
import { verifyLeaderLogin } from '@/lib/students'
import { ensureDatabaseInitialized } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // 先尝试初始化数据库
    try {
      await ensureDatabaseInitialized()
    } catch (dbError: any) {
      console.error('Database initialization error:', dbError)
      const errorMessage = dbError?.message || '数据库初始化失败'
      
      // 检查是否是SQLite在只读文件系统上的错误（Vercel等无服务器环境）
      if (errorMessage.includes('ENOENT') || errorMessage.includes('read-only')) {
        return NextResponse.json(
          { 
            error: '数据库配置错误：检测到只读文件系统。请配置MySQL数据库或检查数据库配置。',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: '数据库连接失败，请检查数据库配置',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      )
    }

    const { name, groupName, password } = await request.json()

    if (!name || !groupName || !password) {
      return NextResponse.json(
        { error: '请填写完整信息（姓名、组名、密码）' },
        { status: 400 }
      )
    }

    // 验证组长登录
    try {
      console.log('[Login] 开始验证登录信息:', { name, groupName, passwordLength: password?.length })
      
      const student = await verifyLeaderLogin(name, groupName, password)

      if (!student) {
        console.log('[Login] 登录失败: 未找到匹配的组长或密码错误')
        return NextResponse.json(
          { error: '登录失败：姓名、组名或密码错误，或该用户不是组长' },
          { status: 401 }
        )
      }

      console.log('[Login] 登录成功:', { studentId: student.id, name: student.name, groupName: student.groupName })

      // 返回学生信息（不包含密码）
      const { groupPassword, ...studentWithoutPassword } = student

      return NextResponse.json({
        success: true,
        student: studentWithoutPassword,
      })
    } catch (queryError: any) {
      console.error('[Login] 查询错误:', queryError)
      console.error('[Login] 错误堆栈:', queryError?.stack)
      
      // 检查是否是表不存在的错误
      if (queryError?.code === 'ER_NO_SUCH_TABLE' || queryError?.message?.includes('doesn\'t exist')) {
        return NextResponse.json(
          { 
            error: '数据库表未创建，请先初始化数据库表',
            details: '请访问应用以确保数据库表已创建，或手动执行建表SQL'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: '查询用户信息时出错',
          details: process.env.NODE_ENV === 'development' ? queryError?.message : '请检查数据库连接和表结构'
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        error: '登录时发生错误，请稍后重试',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}

