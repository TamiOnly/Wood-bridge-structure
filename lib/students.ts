import { getDb, ensureDatabaseInitialized } from './db'

export interface Student {
  id: number
  name: string
  grade: string
  studentId: string
  gender: '男' | '女'
  role: '组长' | '组员'
  groupName: string
  groupPassword: string
  createdAt: string | Date
  updatedAt: string | Date
}

export interface CreateStudentData {
  name: string
  grade: string
  studentId: string
  gender: '男' | '女'
  role: '组长' | '组员'
  groupName: string
  groupPassword: string
}

export interface BatchImportResult {
  success: number
  failed: number
  errors: Array<{ studentId: string; name: string; error: string }>
}

// 添加学生（异步）
export async function addStudent(data: CreateStudentData): Promise<Student> {
  const db = getDb()

  // 检查学号是否已存在
  const existing = await db.queryOne<Student>('SELECT * FROM students WHERE studentId = ?', [data.studentId])
  if (existing) {
    throw new Error('该学号已存在')
  }

  // 检查同一组中是否已有组长（如果当前学生是组长）
  if (data.role === '组长') {
    const existingLeader = await db.queryOne<Student>(
      'SELECT * FROM students WHERE groupName = ? AND role = ?',
      [data.groupName, '组长']
    )
    if (existingLeader) {
      throw new Error('该组已有组长')
    }
  }

  // 如果组中已有学生，验证组密码是否一致
  const groupMember = await db.queryOne<{ groupPassword: string }>(
    'SELECT groupPassword FROM students WHERE groupName = ? LIMIT 1',
    [data.groupName]
  )
  
  if (groupMember && groupMember.groupPassword !== data.groupPassword) {
    throw new Error('组密码与组内其他成员不一致')
  }

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const result = await db.execute(
    `INSERT INTO students (name, grade, studentId, gender, role, groupName, groupPassword, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.name, data.grade, data.studentId, data.gender, data.role, data.groupName, data.groupPassword, now, now]
  )

  const student = await getStudentById(result.lastInsertId || 0)
  if (!student) {
    throw new Error('添加学生失败')
  }

  return student
}

// 批量添加学生（使用事务）
export async function batchAddStudents(students: CreateStudentData[]): Promise<BatchImportResult> {
  const db = getDb()
  const result: BatchImportResult = {
    success: 0,
    failed: 0,
    errors: []
  }

  try {
    await db.beginTransaction()

    for (const student of students) {
      try {
        // 检查学号是否已存在
        const existing = await db.queryOne<Student>(
          'SELECT * FROM students WHERE studentId = ?',
          [student.studentId]
        )
        if (existing) {
          result.failed++
          result.errors.push({
            studentId: student.studentId,
            name: student.name,
            error: '该学号已存在'
          })
          continue
        }

        // 检查同一组中是否已有组长（如果当前学生是组长）
        if (student.role === '组长') {
          const existingLeader = await db.queryOne<Student>(
            'SELECT * FROM students WHERE groupName = ? AND role = ?',
            [student.groupName, '组长']
          )
          if (existingLeader) {
            result.failed++
            result.errors.push({
              studentId: student.studentId,
              name: student.name,
              error: '该组已有组长'
            })
            continue
          }
        }

        // 如果组中已有学生，验证组密码是否一致
        const groupMember = await db.queryOne<{ groupPassword: string }>(
          'SELECT groupPassword FROM students WHERE groupName = ? LIMIT 1',
          [student.groupName]
        )
        
        if (groupMember && groupMember.groupPassword !== student.groupPassword) {
          result.failed++
          result.errors.push({
            studentId: student.studentId,
            name: student.name,
            error: '组密码与组内其他成员不一致'
          })
          continue
        }

        // 验证数据格式
        if (!['男', '女'].includes(student.gender)) {
          result.failed++
          result.errors.push({
            studentId: student.studentId,
            name: student.name,
            error: '性别必须是"男"或"女"'
          })
          continue
        }

        if (!['组长', '组员'].includes(student.role)) {
          result.failed++
          result.errors.push({
            studentId: student.studentId,
            name: student.name,
            error: '角色必须是"组长"或"组员"'
          })
          continue
        }

        // 插入数据
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
        await db.execute(
          `INSERT INTO students (name, grade, studentId, gender, role, groupName, groupPassword, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [student.name, student.grade, student.studentId, student.gender, student.role, student.groupName, student.groupPassword, now, now]
        )
        result.success++
      } catch (error: any) {
        result.failed++
        result.errors.push({
          studentId: student.studentId,
          name: student.name,
          error: error.message || '添加失败'
        })
      }
    }

    await db.commit()
  } catch (error) {
    await db.rollback()
    throw error
  }

  return result
}

// 根据ID获取学生
export async function getStudentById(id: number): Promise<Student | null> {
  const db = getDb()
  const student = await db.queryOne<Student>('SELECT * FROM students WHERE id = ?', [id])
  return student || null
}

// 根据学号获取学生
export async function getStudentByStudentId(studentId: string): Promise<Student | null> {
  const db = getDb()
  const student = await db.queryOne<Student>('SELECT * FROM students WHERE studentId = ?', [studentId])
  return student || null
}

// 根据姓名、组名和密码验证登录（仅组长）
export async function verifyLeaderLogin(name: string, groupName: string, password: string): Promise<Student | null> {
  try {
    const db = getDb()
    
    console.log('[verifyLeaderLogin] 查询条件:', { name, groupName, role: '组长' })
    
    const student = await db.queryOne<Student>(
      'SELECT * FROM students WHERE name = ? AND groupName = ? AND role = ?',
      [name, groupName, '组长']
    )

    if (!student) {
      console.log('[verifyLeaderLogin] 未找到匹配的学生记录')
      return null
    }

    console.log('[verifyLeaderLogin] 找到学生记录:', { 
      id: student.id, 
      name: student.name, 
      groupName: student.groupName,
      role: student.role,
      passwordMatch: student.groupPassword === password 
    })

    // 验证密码
    if (student.groupPassword !== password) {
      console.log('[verifyLeaderLogin] 密码不匹配')
      return null
    }

    return student
  } catch (error: any) {
    console.error('[verifyLeaderLogin] 查询异常:', error)
    console.error('[verifyLeaderLogin] 错误详情:', {
      message: error?.message,
      code: error?.code,
      sqlState: error?.sqlState,
      sqlMessage: error?.sqlMessage
    })
    throw error
  }
}

// 获取组的所有成员
export async function getGroupMembers(groupName: string): Promise<Student[]> {
  const db = getDb()
  const students = await db.queryAll<Student>(
    'SELECT * FROM students WHERE groupName = ? ORDER BY role DESC, name ASC',
    [groupName]
  )
  return students
}

// 获取所有学生
export async function getAllStudents(): Promise<Student[]> {
  const db = getDb()
  const students = await db.queryAll<Student>(
    'SELECT * FROM students ORDER BY groupName, role DESC, name ASC'
  )
  return students
}

// 更新学生信息
export async function updateStudent(id: number, data: Partial<CreateStudentData>): Promise<Student | null> {
  const db = getDb()
  const updates: string[] = []
  const values: any[] = []

  if (data.name !== undefined) {
    updates.push('name = ?')
    values.push(data.name)
  }
  if (data.grade !== undefined) {
    updates.push('grade = ?')
    values.push(data.grade)
  }
  if (data.gender !== undefined) {
    updates.push('gender = ?')
    values.push(data.gender)
  }
  if (data.role !== undefined) {
    updates.push('role = ?')
    values.push(data.role)
  }
  if (data.groupName !== undefined) {
    updates.push('groupName = ?')
    values.push(data.groupName)
  }
  if (data.groupPassword !== undefined) {
    updates.push('groupPassword = ?')
    values.push(data.groupPassword)
  }

  if (updates.length === 0) {
    return getStudentById(id)
  }

  // 更新 updatedAt 时间戳
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  updates.push('updatedAt = ?')
  values.push(now)
  values.push(id)

  await db.execute(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`, values)

  return getStudentById(id)
}

// 删除学生
export async function deleteStudent(id: number): Promise<boolean> {
  const db = getDb()
  const result = await db.execute('DELETE FROM students WHERE id = ?', [id])
  return result.affectedRows > 0
}

// 批量删除学生（按学号列表）
export async function batchDeleteStudents(studentIds: string[]): Promise<number> {
  const db = getDb()
  let deletedCount = 0
  
  for (const studentId of studentIds) {
    const result = await db.execute('DELETE FROM students WHERE studentId = ?', [studentId])
    deletedCount += result.affectedRows
  }
  
  return deletedCount
}

// 获取学生统计信息
export async function getStudentStats() {
  const db = getDb()
  const total = await db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM students')
  const leaders = await db.queryOne<{ count: number }>("SELECT COUNT(*) as count FROM students WHERE role = '组长'")
  const members = await db.queryOne<{ count: number }>("SELECT COUNT(*) as count FROM students WHERE role = '组员'")
  const groups = await db.queryOne<{ count: number }>('SELECT COUNT(DISTINCT groupName) as count FROM students')
  
  return {
    total: total?.count || 0,
    leaders: leaders?.count || 0,
    members: members?.count || 0,
    groups: groups?.count || 0
  }
}

// 为了向后兼容，提供同步版本的函数（仅SQLite）
// 这些函数仅在SQLite模式下可用，用于脚本
// 注意：在 Vercel 等生产环境中不会使用此函数
export function addStudentSync(data: CreateStudentData): Student {
  // 动态检查是否是 SQLite 适配器，避免静态导入
  const db = getDb()
  const dbType = db.constructor.name
  if (dbType !== 'SQLiteAdapter') {
    throw new Error('同步函数仅支持SQLite数据库')
  }
  
  // 使用类型断言访问 SQLite 特有的方法
  // 这些方法在 DatabaseAdapter 接口中没有定义
  const sqliteDb = db as any
  if (!sqliteDb.transaction || !sqliteDb.queryOneSync) {
    throw new Error('SQLite 同步方法不可用')
  }
  
  // 使用SQLite的事务方法
  return sqliteDb.transaction(() => {
    // 实现同步逻辑（保持原有逻辑）
    const existing = sqliteDb.queryOneSync('SELECT * FROM students WHERE studentId = ?', [data.studentId])
    if (existing) {
      throw new Error('该学号已存在')
    }
    
    // ... 其他同步逻辑
    // 注意：这里需要实现同步版本，但为了简化，建议脚本也使用异步方式
    throw new Error('请使用异步版本的函数 addStudent')
  })
}
