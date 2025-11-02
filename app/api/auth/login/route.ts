import { NextRequest, NextResponse } from 'next/server'
import { verifyLeaderLoginHardcoded } from '@/lib/hardcoded-students'
import { verifyLeaderLogin } from '@/lib/students'
import { ensureDatabaseInitialized } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, groupName, password } = await request.json()

    if (!name || !groupName || !password) {
      return NextResponse.json(
        { error: '请填写完整信息（姓名、组名、密码）' },
        { status: 400 }
      )
    }

    console.log('[Login] 开始验证登录信息:', { name, groupName, passwordLength: password?.length })

    // 优先使用硬编码验证（不依赖数据库，适用于 Vercel 等无数据库环境）
    const hardcodedStudent = verifyLeaderLoginHardcoded(name, groupName, password)
    
    if (hardcodedStudent) {
      console.log('[Login] 登录成功（硬编码验证）:', { 
        studentId: hardcodedStudent.id, 
        name: hardcodedStudent.name, 
        groupName: hardcodedStudent.groupName 
      })

      // 返回学生信息（不包含密码）
      const { groupPassword, ...studentWithoutPassword } = hardcodedStudent

      return NextResponse.json({
        success: true,
        student: studentWithoutPassword,
      })
    }

    // 如果硬编码验证失败，尝试数据库验证（用于本地开发或有数据库的环境）
    try {
      await ensureDatabaseInitialized()
      
      const dbStudent = await verifyLeaderLogin(name, groupName, password)

      if (dbStudent) {
        console.log('[Login] 登录成功（数据库验证）:', { 
          studentId: dbStudent.id, 
          name: dbStudent.name, 
          groupName: dbStudent.groupName 
        })

        const { groupPassword, ...studentWithoutPassword } = dbStudent

        return NextResponse.json({
          success: true,
          student: studentWithoutPassword,
        })
      }
    } catch (dbError: any) {
      // 数据库验证失败，但这不是致命错误，因为我们优先使用硬编码
      console.warn('[Login] 数据库验证失败（非致命错误）:', dbError?.message)
    }

    // 两种验证方式都失败
    console.log('[Login] 登录失败: 未找到匹配的组长或密码错误')
    return NextResponse.json(
      { error: '登录失败：姓名、组名或密码错误，或该用户不是组长' },
      { status: 401 }
    )
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

