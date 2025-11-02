// 测试扣子 v3/chat API
require('dotenv').config()

const apiKey = process.env.COZE_API_KEY
const botId = process.env.COZE_BOT_ID

async function testV3() {
  console.log('='.repeat(60))
  console.log('测试扣子 v3/chat API')
  console.log('='.repeat(60))
  console.log('Bot ID:', botId)
  console.log('')

  const userId = `user_${Date.now()}`
  const requestBody = {
    bot_id: botId,
    user_id: userId,
    stream: true, // 使用流式响应
    additional_messages: [
      {
        content: '你好',
        content_type: 'text',
        role: 'user',
        type: 'question'
      }
    ],
    parameters: {}
  }

  console.log('请求体:')
  console.log(JSON.stringify(requestBody, null, 2))
  console.log('')

  try {
    const response = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    console.log('响应状态:', response.status, response.statusText)
    console.log('Content-Type:', response.headers.get('content-type'))
    console.log('')

    // 如果是流式响应
    if (requestBody.stream) {
      console.log('处理流式响应...')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''
      let eventId = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventId = line.substring(6).trim()
          } else if (line.startsWith('data:')) {
            try {
              const data = JSON.parse(line.substring(5).trim())
              console.log(`事件: ${eventId}`, JSON.stringify(data, null, 2))
              
              if (data.event === 'conversation.message.delta' && data.data?.content) {
                fullContent += data.data.content
                process.stdout.write(data.data.content)
              } else if (data.event === 'conversation.message.completed' && data.data) {
                console.log('\n\n✅✅✅ 消息完成!')
                console.log('完整消息:', JSON.stringify(data.data, null, 2))
                if (data.data.content) {
                  console.log('\n智能体回答:')
                  console.log(data.data.content)
                }
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
      
      if (fullContent) {
        console.log('\n\n✅✅✅ 完整回答:')
        console.log(fullContent)
      }
    } else {
      // 非流式响应
      const data = await response.json()
      console.log('响应数据:')
      console.log(JSON.stringify(data, null, 2))
      console.log('')

      // 检查状态
      if (data.code === 0) {
        if (data.data?.status === 'in_progress') {
          console.log('⚠️ 请求正在处理中，可能需要使用流式响应(stream: true)')
          console.log('或者需要轮询获取结果')
        } else if (data.data?.messages) {
          const assistantMsg = data.data.messages.find((msg) => 
            msg.role === 'assistant' && msg.type === 'answer'
          )
          if (assistantMsg?.content) {
            console.log('✅✅✅ 成功! 智能体回答:')
            console.log(assistantMsg.content)
          } else {
            console.log('⚠️ 无法找到回答消息')
          }
        } else {
          console.log('⚠️ 响应格式:', Object.keys(data.data || {}))
        }
      } else {
        console.log('❌ 响应格式不正确或出错')
        console.log('code:', data.code)
        console.log('msg:', data.msg)
      }
    }

  } catch (error) {
    console.error('❌ 请求失败:', error.message)
  }
}

testV3()

