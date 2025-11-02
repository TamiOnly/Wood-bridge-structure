import { NextRequest, NextResponse } from 'next/server'
import { getAllStudents, addStudent, CreateStudentData } from '@/lib/students'
import { ensureDatabaseInitialized } from '@/lib/db'

// 获取所有学生
export async function GET() {
  await ensureDatabaseInitialized()
  try {
    const students = await getAllStudents()
    
    // 移除密码字段
    const studentsWithoutPassword = students.map(({ groupPassword, ...student }) => student)
    
    return NextResponse.json({
      success: true,
      students: studentsWithoutPassword,
    })
  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json(
      { error: '获取学生列表失败' },
      { status: 500 }
    )
  }
}

// 添加学生
export async function POST(request: NextRequest) {
  try {
    const data: CreateStudentData = await request.json()

    // 验证必填字段
    if (!data.name || !data.grade || !data.studentId || !data.gender || !data.role || !data.groupName || !data.groupPassword) {
      return NextResponse.json(
        { error: '请填写完整的学生信息' },
        { status: 400 }
      )
    }

    // 验证性别和角色
    if (!['男', '女'].includes(data.gender)) {
      return NextResponse.json(
        { error: '性别必须是"男"或"女"' },
        { status: 400 }
      )
    }

    if (!['组长', '组员'].includes(data.role)) {
      return NextResponse.json(
        { error: '角色必须是"组长"或"组员"' },
        { status: 400 }
      )
    }

    const student = await addStudent(data)

    // 移除密码字段
    const { groupPassword, ...studentWithoutPassword } = student

    return NextResponse.json({
      success: true,
      student: studentWithoutPassword,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Add student error:', error)
    return NextResponse.json(
      { error: error.message || '添加学生失败' },
      { status: 400 }
    )
  }
}

