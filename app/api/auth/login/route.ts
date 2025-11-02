import { NextRequest, NextResponse } from 'next/server'
import { verifyLeaderLogin } from '@/lib/students'
import { ensureDatabaseInitialized } from '@/lib/db'

export async function POST(request: NextRequest) {
  await ensureDatabaseInitialized()
  try {
    const { name, groupName, password } = await request.json()

    if (!name || !groupName || !password) {
      return NextResponse.json(
        { error: '请填写完整信息（姓名、组名、密码）' },
        { status: 400 }
      )
    }

    // 验证组长登录
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
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录时发生错误，请稍后重试' },
      { status: 500 }
    )
  }
}

