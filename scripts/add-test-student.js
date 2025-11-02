// 用于添加测试学生数据的脚本
// 使用方法: node scripts/add-test-student.js

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

// 示例测试数据
const testStudents = [
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
  },
  {
    name: '王五',
    grade: '高一',
    studentId: '2024003',
    gender: '男',
    role: '组员',
    groupName: '第一组',
    groupPassword: '123456'
  },
  {
    name: '赵六',
    grade: '高二',
    studentId: '2023001',
    gender: '女',
    role: '组长',
    groupName: '第二组',
    groupPassword: 'abc123'
  },
  {
    name: '孙七',
    grade: '高二',
    studentId: '2023002',
    gender: '男',
    role: '组员',
    groupName: '第二组',
    groupPassword: 'abc123'
  }
]

const stmt = db.prepare(`
  INSERT OR IGNORE INTO students (name, grade, studentId, gender, role, groupName, groupPassword)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

console.log('开始添加测试学生数据...')

for (const student of testStudents) {
  try {
    stmt.run(
      student.name,
      student.grade,
      student.studentId,
      student.gender,
      student.role,
      student.groupName,
      student.groupPassword
    )
    console.log(`✓ 添加学生: ${student.name} (${student.role}) - ${student.groupName}`)
  } catch (error) {
    console.error(`✗ 添加失败: ${student.name} - ${error.message}`)
  }
}

console.log('\n测试学生数据添加完成！')
console.log('\n登录信息示例:')
console.log('第一组组长: 姓名=张三, 组名=第一组, 密码=123456')
console.log('第二组组长: 姓名=赵六, 组名=第二组, 密码=abc123')

db.close()

