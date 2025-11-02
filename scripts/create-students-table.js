// 创建 students 表的脚本
// 使用方法: node scripts/create-students-table.js

require('dotenv').config()
const mysql = require('mysql2/promise')

async function createTable() {
  console.log('正在连接到 MySQL 并创建 students 表...\n')

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'students_db'
  }

  try {
    const connection = await mysql.createConnection(config)
    console.log('✓ 成功连接到数据库\n')

    // 检查表是否已存在
    const [tables] = await connection.query('SHOW TABLES LIKE ?', ['students'])
    
    if (tables.length > 0) {
      console.log('⚠ students 表已存在')
      console.log('是否要删除并重新创建？(y/n): ')
      
      // 在非交互模式下，直接删除并重建
      console.log('删除旧表...')
      await connection.query('DROP TABLE IF EXISTS students')
    }

    console.log('正在创建 students 表...')

    // MySQL 建表语句（兼容 MySQL 5.5）
    // 注意：MySQL 5.5 限制一个表只能有一个 TIMESTAMP 字段使用 CURRENT_TIMESTAMP
    // 因此使用 DATETIME 类型，时间戳由应用层处理
    await connection.query(`
      CREATE TABLE students (
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

    console.log('✓ students 表创建成功\n')

    // 验证表结构
    const [columns] = await connection.query('DESCRIBE students')
    console.log('表结构:')
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`)
    })

    // 检查索引
    const [indexes] = await connection.query('SHOW INDEX FROM students')
    console.log('\n索引:')
    const uniqueIndexes = [...new Set(indexes.map(idx => idx.Key_name))]
    uniqueIndexes.forEach(idxName => {
      console.log(`  - ${idxName}`)
    })

    await connection.end()

    console.log('\n=== 表创建完成 ===')
    console.log('\n可以运行以下命令添加测试数据:')
    console.log('  node scripts/add-test-student.js')

  } catch (error) {
    console.error('\n✗ 错误:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n提示: 无法连接到 MySQL 服务器')
      console.error('请确保 MySQL 服务正在运行')
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n提示: 用户名或密码错误')
      console.error('请检查 .env 文件中的配置')
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`\n提示: 数据库 ${config.database} 不存在`)
      console.error('请先创建数据库')
    } else {
      console.error('\n详细错误:', error)
    }
    
    process.exit(1)
  }
}

createTable()

