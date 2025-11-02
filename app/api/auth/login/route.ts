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
      const student = await verifyLeaderLogin(name, groupName, password)

      if (!student) {
        return NextResponse.json(
          { error: '登录失败：姓名、组名或密码错误，或该用户不是组长' },
          { status: 401 }
        )
      }

      // 返回学生信息（不包含密码）
      const { groupPassword, ...studentWithoutPassword } = student

      return NextResponse.json({
        success: true,
        student: studentWithoutPassword,
      })
    } catch (queryError: any) {
      console.error('Query error:', queryError)
      return NextResponse.json(
        { 
          error: '查询用户信息时出错，请检查数据库连接',
          details: process.env.NODE_ENV === 'development' ? queryError?.message : undefined
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

