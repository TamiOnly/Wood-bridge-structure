import { NextRequest, NextResponse } from 'next/server'
import { batchAddStudents, CreateStudentData } from '@/lib/students'
import { ensureDatabaseInitialized } from '@/lib/db'

// 批量导入学生
export async function POST(request: NextRequest) {
  await ensureDatabaseInitialized()
  try {
    const { students } = await request.json()

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { error: '请提供学生数据数组' },
        { status: 400 }
      )
    }

    // 验证每个学生的数据格式
    const validatedStudents: CreateStudentData[] = []
    for (let i = 0; i < students.length; i++) {
      const student = students[i]
      
      if (!student.name || !student.grade || !student.studentId || 
          !student.gender || !student.role || !student.groupName || !student.groupPassword) {
        return NextResponse.json(
          { error: `第 ${i + 1} 个学生信息不完整` },
          { status: 400 }
        )
      }

      if (!['男', '女'].includes(student.gender)) {
        return NextResponse.json(
          { error: `第 ${i + 1} 个学生：性别必须是"男"或"女"` },
          { status: 400 }
        )
      }

      if (!['组长', '组员'].includes(student.role)) {
        return NextResponse.json(
          { error: `第 ${i + 1} 个学生：角色必须是"组长"或"组员"` },
          { status: 400 }
        )
      }

      validatedStudents.push(student)
    }

    // 批量添加
    const result = await batchAddStudents(validatedStudents)

    return NextResponse.json({
      success: true,
      result: {
        total: students.length,
        success: result.success,
        failed: result.failed,
        errors: result.errors
      }
    })
  } catch (error: any) {
    console.error('Batch import error:', error)
    return NextResponse.json(
      { error: error.message || '批量导入失败' },
      { status: 500 }
    )
  }
}

