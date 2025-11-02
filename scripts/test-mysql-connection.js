// 测试 MySQL 连接脚本
// 使用方法: node scripts/test-mysql-connection.js

require('dotenv').config()
const mysql = require('mysql2/promise')

async function testConnection() {
  console.log('正在测试 MySQL 连接...\n')
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'students_db'
  }

  console.log('连接配置:')
  console.log(`  主机: ${config.host}`)
  console.log(`  端口: ${config.port}`)
  console.log(`  用户: ${config.user}`)
  console.log(`  数据库: ${config.database}`)
  console.log(`  密码: ${config.password ? '***' : '(空)'}\n`)

  try {
    // 先测试不指定数据库的连接（用于创建数据库）
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password
    })

    console.log('✓ 成功连接到 MySQL 服务器')

    // 检查数据库是否存在
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [config.database])
    
    if (databases.length === 0) {
      console.log(`\n数据库 ${config.database} 不存在`)
      console.log('正在创建数据库...')
      await connection.query(`CREATE DATABASE ${config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
      console.log(`✓ 数据库 ${config.database} 创建成功`)
    } else {
      console.log(`✓ 数据库 ${config.database} 已存在`)
    }

    await connection.end()

    // 测试连接到指定数据库
    const dbConnection = await mysql.createConnection(config)
    console.log(`✓ 成功连接到数据库 ${config.database}`)
    
    // 检查表是否存在
    const [tables] = await dbConnection.query('SHOW TABLES LIKE ?', ['students'])
    if (tables.length > 0) {
      console.log('✓ students 表已存在')
      const [rows] = await dbConnection.query('SELECT COUNT(*) as count FROM students')
      console.log(`✓ 当前有 ${rows[0].count} 条学生记录`)
    } else {
      console.log('⚠ students 表不存在（首次运行时会自动创建）')
    }

    await dbConnection.end()

    console.log('\n=== 连接测试成功 ===')
    console.log('\n可以运行以下命令启动应用:')
    console.log('  npm run dev')
    
  } catch (error) {
    console.error('\n✗ 连接失败:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n提示: 无法连接到 MySQL 服务器')
      console.error('请检查:')
      console.error('1. MySQL 服务是否正在运行')
      console.error('2. 主机地址和端口是否正确')
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n提示: 用户名或密码错误')
      console.error('请检查 .env 文件中的 DB_USER 和 DB_PASSWORD')
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`\n提示: 数据库 ${config.database} 不存在`)
      console.error('请先创建数据库或运行此脚本自动创建')
    } else {
      console.error('\n详细错误:', error)
    }
    
    process.exit(1)
  }
}

testConnection()

