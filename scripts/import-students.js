// 批量导入学生数据脚本
// 支持从JSON文件或直接在脚本中定义数据
// 使用方法: 
//   1. 从JSON文件导入: node scripts/import-students.js data/students.json
//   2. 使用脚本中的数据: node scripts/import-students.js

const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const dbPath = path.join(__dirname, '..', 'data', 'students.db')
const dataDir = path.dirname(dbPath)

// 确保data目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(dbPath)

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    studentId TEXT NOT NULL UNIQUE,
    gender TEXT NOT NULL CHECK(gender IN ('男', '女')),
    role TEXT NOT NULL CHECK(role IN ('组长', '组员')),
    groupName TEXT NOT NULL,
    groupPassword TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// 批量导入函数
function batchImportStudents(students) {
  const result = {
    success: 0,
    failed: 0,
    errors: []
  }

  const transaction = db.transaction(() => {
    const insertStmt = db.prepare(`
      INSERT INTO students (name, grade, studentId, gender, role, groupName, groupPassword)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    for (const student of students) {
      try {
        // 检查学号是否已存在
        const existing = db.prepare('SELECT * FROM students WHERE studentId = ?').get(student.studentId)
        if (existing) {
          result.failed++
          result.errors.push({
            studentId: student.studentId,
            name: student.name,
            error: '该学号已存在'
          })
          continue
        }

        // 检查同一组中是否已有组长
        if (student.role === '组长') {
          const existingLeader = db
            .prepare('SELECT * FROM students WHERE groupName = ? AND role = ?')
            .get(student.groupName, '组长')
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

        // 验证组密码一致性
        const groupMember = db
          .prepare('SELECT groupPassword FROM students WHERE groupName = ? LIMIT 1')
          .get(student.groupName)
        
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
        insertStmt.run(
          student.name,
          student.grade,
          student.studentId,
          student.gender,
          student.role,
          student.groupName,
          student.groupPassword
        )
        result.success++
        console.log(`✓ 添加: ${student.name} (${student.role}) - ${student.groupName}`)
      } catch (error) {
        result.failed++
        result.errors.push({
          studentId: student.studentId,
          name: student.name,
          error: error.message || '添加失败'
        })
        console.error(`✗ 失败: ${student.name} - ${error.message}`)
      }
    }
  })

  transaction()
  return result
}

// 读取数据
let students = []

// 如果提供了文件路径参数
if (process.argv[2]) {
  const filePath = path.resolve(process.argv[2])
  
  if (!fs.existsSync(filePath)) {
    console.error(`错误: 文件不存在 - ${filePath}`)
    process.exit(1)
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    if (Array.isArray(data)) {
      students = data
    } else if (data.students && Array.isArray(data.students)) {
      students = data.students
    } else {
      console.error('错误: JSON文件格式不正确，应该是数组或包含students字段的对象')
      process.exit(1)
    }
  } catch (error) {
    console.error('错误: 读取或解析JSON文件失败', error.message)
    process.exit(1)
  }
} else {
  // 使用默认示例数据
  console.log('提示: 没有提供文件路径，使用示例数据')
  console.log('使用方法: node scripts/import-students.js <JSON文件路径>')
  console.log('')
  
  students = [
    {
      name: '张三',
      grade: '高一',
      studentId: '2024001',
      gender: '男',
      role: '组长',
      groupName: '第一组',
      groupPassword: '123456'
    },
    {
      name: '李四',
      grade: '高一',
      studentId: '2024002',
      gender: '女',
      role: '组员',
      groupName: '第一组',
      groupPassword: '123456'
    }
  ]
}

// 执行导入
console.log(`开始导入 ${students.length} 条学生数据...\n`)
const result = batchImportStudents(students)

console.log('\n导入完成！')
console.log(`总计: ${students.length} 条`)
console.log(`成功: ${result.success} 条`)
console.log(`失败: ${result.failed} 条`)

if (result.errors.length > 0) {
  console.log('\n错误详情:')
  result.errors.forEach((err, index) => {
    console.log(`${index + 1}. ${err.name} (${err.studentId}): ${err.error}`)
  })
}

db.close()

