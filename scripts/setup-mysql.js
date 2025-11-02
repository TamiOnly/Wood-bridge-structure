// MySQL 数据库设置脚本
// 使用方法: node scripts/setup-mysql.js

const mysql = require('mysql2/promise')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function setupDatabase() {
  console.log('=== MySQL 数据库设置向导 ===\n')

  try {
    // 获取连接信息
    const host = await question('MySQL 主机地址 (默认: localhost): ') || 'localhost'
    const port = await question('MySQL 端口 (默认: 3306): ') || '3306'
    const user = await question('MySQL 用户名 (默认: root): ') || 'root'
    const password = await question('MySQL 密码: ')
    
    if (!password) {
      console.log('\n警告: 未输入密码，尝试使用空密码连接...')
    }

    // 尝试连接
    console.log('\n正在连接到 MySQL 服务器...')
    const connection = await mysql.createConnection({
      host: host,
      port: parseInt(port),
      user: user,
      password: password
    })

    console.log('✓ 成功连接到 MySQL 服务器\n')

    // 创建数据库
    const dbName = await question('数据库名称 (默认: students_db): ') || 'students_db'
    
    console.log(`\n正在创建数据库 ${dbName}...`)
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    console.log(`✓ 数据库 ${dbName} 创建成功\n`)

    await connection.end()

    // 生成 .env 文件内容
    const envContent = `# 数据库类型：mysql
DB_TYPE=mysql

# MySQL 配置
DB_HOST=${host}
DB_PORT=${port}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${dbName}
DB_CONNECTION_LIMIT=10
DB_WAIT_FOR_CONNECTIONS=true
DB_QUEUE_LIMIT=0
`

    // 写入 .env 文件
    const fs = require('fs')
    const path = require('path')
    const envPath = path.join(__dirname, '..', '.env')
    
    fs.writeFileSync(envPath, envContent, 'utf-8')
    console.log('✓ .env 文件已创建\n')

    console.log('=== 设置完成 ===')
    console.log('\n下一步:')
    console.log('1. 重启开发服务器: npm run dev')
    console.log('2. 系统会自动创建数据库表结构')
    console.log('\n提示: .env 文件已添加到 .gitignore，不会被提交到版本控制')

  } catch (error) {
    console.error('\n✗ 错误:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n提示: 无法连接到 MySQL 服务器')
      console.error('请确保 MySQL 服务正在运行')
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n提示: 用户名或密码错误')
    } else {
      console.error('\n详细错误:', error)
    }
    
    process.exit(1)
  } finally {
    rl.close()
  }
}

setupDatabase()

