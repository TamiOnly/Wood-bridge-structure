// 从CSV文件导入学生数据
// 使用方法: node scripts/import-from-csv.js data/students.csv
//
// CSV格式要求（第一行为标题行）:
// 姓名,年级,学号,性别,角色,组名,小组密码
// 张三,高一,2024001,男,组长,第一组,123456

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

// 解析CSV文件
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    throw new Error('CSV文件至少需要包含标题行和一行数据')
  }

  // 解析标题行
  const headers = lines[0].split(',').map(h => h.trim())
  
  // 验证标题
  const requiredHeaders = ['姓名', '年级', '学号', '性别', '角色', '组名', '小组密码']
  const headerMap = {}
  
  requiredHeaders.forEach(reqHeader => {
    const index = headers.findIndex(h => h === reqHeader)
    if (index === -1) {
      throw new Error(`CSV文件缺少必需的列: ${reqHeader}`)
    }
    headerMap[reqHeader] = index
  })

  // 解析数据行
  const students = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    
    if (values.length < headers.length) {
      console.warn(`警告: 第 ${i + 1} 行数据不完整，已跳过`)
      continue
    }

    students.push({
      name: values[headerMap['姓名']],
      grade: values[headerMap['年级']],
      studentId: values[headerMap['学号']],
      gender: values[headerMap['性别']],
      role: values[headerMap['角色']],
      groupName: values[headerMap['组名']],
      groupPassword: values[headerMap['小组密码']]
    })
  }

  return students
}

// 批量导入函数（与import-students.js相同）
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

// 主程序
if (!process.argv[2]) {
  console.error('错误: 请提供CSV文件路径')
  console.log('使用方法: node scripts/import-from-csv.js <CSV文件路径>')
  console.log('')
  console.log('CSV格式示例:')
  console.log('姓名,年级,学号,性别,角色,组名,小组密码')
  console.log('张三,高一,2024001,男,组长,第一组,123456')
  process.exit(1)
}

const csvPath = path.resolve(process.argv[2])

if (!fs.existsSync(csvPath)) {
  console.error(`错误: 文件不存在 - ${csvPath}`)
  process.exit(1)
}

try {
  console.log(`读取CSV文件: ${csvPath}\n`)
  const students = parseCSV(csvPath)
  
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
} catch (error) {
  console.error('错误:', error.message)
  process.exit(1)
} finally {
  db.close()
}

