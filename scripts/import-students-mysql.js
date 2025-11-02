// 批量导入学生数据到 MySQL 数据库
// 使用方法: node scripts/import-students-mysql.js [JSON文件路径]
// 如果没有提供文件路径，默认使用 data/students.json

require('dotenv').config()
const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function importStudents() {
  console.log('========================================')
  console.log('批量导入学生数据到 MySQL')
  console.log('========================================\n')

  // 读取数据库配置
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'students_db'
  }

  console.log('数据库配置:')
  console.log(`  主机: ${config.host}`)
  console.log(`  端口: ${config.port}`)
  console.log(`  用户: ${config.user}`)
  console.log(`  数据库: ${config.database}\n`)

  // 读取 JSON 文件
  const jsonPath = process.argv[2] || path.join(__dirname, '..', 'data', 'students.json')
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ 错误: 文件不存在 - ${jsonPath}`)
    process.exit(1)
  }

  console.log(`读取文件: ${jsonPath}`)
  let fileContent
  try {
    fileContent = fs.readFileSync(jsonPath, 'utf-8')
  } catch (error) {
    console.error(`❌ 读取文件失败: ${error.message}`)
    process.exit(1)
  }

  let jsonData
  try {
    jsonData = JSON.parse(fileContent)
  } catch (error) {
    console.error(`❌ JSON 解析失败: ${error.message}`)
    process.exit(1)
  }

  // 提取学生数据数组
  let students = []
  if (Array.isArray(jsonData)) {
    students = jsonData
  } else if (jsonData.RECORDS && Array.isArray(jsonData.RECORDS)) {
    students = jsonData.RECORDS
  } else if (jsonData.students && Array.isArray(jsonData.students)) {
    students = jsonData.students
  } else {
    console.error('❌ JSON 格式不正确，应该是数组或包含 RECORDS/students 字段的对象')
    process.exit(1)
  }

  console.log(`找到 ${students.length} 条学生记录\n`)

  // 连接数据库
  let connection
  try {
    connection = await mysql.createConnection(config)
    console.log('✅ 成功连接到 MySQL 数据库\n')
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    console.error('\n请检查:')
    console.error('1. 数据库配置是否正确 (.env 文件)')
    console.error('2. 数据库是否已创建')
    console.error('3. 网络连接是否正常')
    process.exit(1)
  }

  // 确保表已创建
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        grade VARCHAR(50) NOT NULL,
        studentId VARCHAR(50) NOT NULL UNIQUE,
        gender ENUM('男', '女') NOT NULL,
        role ENUM('组长', '组员') NOT NULL,
        groupName VARCHAR(100) NOT NULL,
        groupPassword VARCHAR(100) NOT NULL,
        createdAt DATETIME,
        updatedAt DATETIME,
        INDEX idx_studentId (studentId),
        INDEX idx_groupName (groupName),
        INDEX idx_role (role),
        INDEX idx_name_group (name, groupName)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('✅ 数据库表已准备就绪\n')
  } catch (error) {
    console.error('❌ 创建表失败:', error.message)
    await connection.end()
    process.exit(1)
  }

  // 批量导入
  const result = {
    success: 0,
    failed: 0,
    errors: []
  }

  console.log('开始导入数据...\n')

  for (const student of students) {
    try {
      // 移除 id 字段（让数据库自动生成）
      const { id, createdAt, updatedAt, ...studentData } = student

      // 验证必填字段
      if (!studentData.name || !studentData.grade || !studentData.studentId || 
          !studentData.gender || !studentData.role || !studentData.groupName || !studentData.groupPassword) {
        result.failed++
        result.errors.push({
          name: studentData.name || '未知',
          studentId: studentData.studentId || '未知',
          error: '必填字段缺失'
        })
        console.log(`✗ 跳过: ${studentData.name || '未知'} - 必填字段缺失`)
        continue
      }

      // 验证性别
      if (!['男', '女'].includes(studentData.gender)) {
        result.failed++
        result.errors.push({
          name: studentData.name,
          studentId: studentData.studentId,
          error: `性别无效: ${studentData.gender}`
        })
        console.log(`✗ 失败: ${studentData.name} - 性别无效`)
        continue
      }

      // 验证角色
      if (!['组长', '组员'].includes(studentData.role)) {
        result.failed++
        result.errors.push({
          name: studentData.name,
          studentId: studentData.studentId,
          error: `角色无效: ${studentData.role}`
        })
        console.log(`✗ 失败: ${studentData.name} - 角色无效`)
        continue
      }

      // 检查学号是否已存在
      const [existing] = await connection.query(
        'SELECT * FROM students WHERE studentId = ?',
        [studentData.studentId]
      )
      
      if (existing.length > 0) {
        // 如果已存在，使用 UPDATE
        await connection.query(
          `UPDATE students SET 
            name = ?, grade = ?, gender = ?, role = ?, 
            groupName = ?, groupPassword = ?, updatedAt = NOW()
           WHERE studentId = ?`,
          [
            studentData.name,
            studentData.grade,
            studentData.gender,
            studentData.role,
            studentData.groupName,
            studentData.groupPassword,
            studentData.studentId
          ]
        )
        result.success++
        console.log(`↻ 更新: ${studentData.name} (${studentData.role}) - ${studentData.groupName}`)
      } else {
        // 插入新记录
        await connection.query(
          `INSERT INTO students (name, grade, studentId, gender, role, groupName, groupPassword, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            studentData.name,
            studentData.grade,
            studentData.studentId,
            studentData.gender,
            studentData.role,
            studentData.groupName,
            studentData.groupPassword
          ]
        )
        result.success++
        console.log(`✓ 添加: ${studentData.name} (${studentData.role}) - ${studentData.groupName}`)
      }
    } catch (error) {
      result.failed++
      result.errors.push({
        name: student.name || '未知',
        studentId: student.studentId || '未知',
        error: error.message || '导入失败'
      })
      console.error(`✗ 失败: ${student.name || '未知'} - ${error.message}`)
    }
  }

  // 关闭连接
  await connection.end()

  // 输出结果
  console.log('\n' + '='.repeat(40))
  console.log('导入完成！')
  console.log('='.repeat(40))
  console.log(`总计: ${students.length} 条`)
  console.log(`成功: ${result.success} 条`)
  console.log(`失败: ${result.failed} 条`)

  if (result.errors.length > 0) {
    console.log('\n错误详情:')
    result.errors.forEach((err, index) => {
      console.log(`  ${index + 1}. ${err.name} (${err.studentId}): ${err.error}`)
    })
  }

  console.log('\n✅ 导入操作完成！\n')
}

// 执行导入
importStudents().catch(error => {
  console.error('\n❌ 发生错误:', error)
  process.exit(1)
})

