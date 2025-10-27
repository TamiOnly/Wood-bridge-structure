'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
// import { toast } from 'react-hot-toast'
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  BookOpen, 
  Calculator,
  Zap,
  HelpCircle
} from 'lucide-react'

export default function ChatInterface() {
  const { chatMessages, addChatMessage } = useAppStore()
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  // 预设问题模板
  const quickQuestions = [
    {
      icon: Lightbulb,
      text: '桥梁结构有哪些类型？',
      category: '基础概念'
    },
    {
      icon: Calculator,
      text: '如何计算桥梁的承重能力？',
      category: '计算方法'
    },
    {
      icon: BookOpen,
      text: '木结构桥梁的设计原理是什么？',
      category: '设计原理'
    },
    {
      icon: Zap,
      text: '如何提高桥梁的稳定性？',
      category: '优化建议'
    },
    {
      icon: HelpCircle,
      text: '桥梁设计时需要考虑哪些荷载？',
      category: '荷载分析'
    },
    {
      icon: Lightbulb,
      text: '如何选择合适的木材？',
      category: '材料选择'
    },
    {
      icon: Calculator,
      text: '桥梁跨度与材料用量的关系？',
      category: '经济分析'
    },
    {
      icon: BookOpen,
      text: '桥梁施工中需要注意什么？',
      category: '施工要点'
    }
  ]

  // 智能回答系统
  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    // 问候语和简单问题
    if (lowerQuestion.includes('你好') || lowerQuestion.includes('hello') || lowerQuestion.includes('hi')) {
      return `你好！我是您的桥梁学习助手 🤖

很高兴为您服务！我可以帮助您：
• 解答桥梁工程相关问题
• 提供结构力学知识
• 指导材料选择
• 分析设计原理
• 给出学习建议

请告诉我您想了解什么，我会尽力为您详细解答！`
    }

    // 感谢和结束语
    if (lowerQuestion.includes('谢谢') || lowerQuestion.includes('thank') || lowerQuestion.includes('再见')) {
      return `不客气！很高兴能帮助您学习桥梁工程知识 🌉

如果您还有其他问题，随时可以问我。祝您学习愉快！

记住：
• 实践是学习的最好方法
• 多动手设计，多思考原理
• 遇到问题不要怕，我们一起解决！`
    }

    // 桥梁类型相关
    if (lowerQuestion.includes('桥梁') && (lowerQuestion.includes('类型') || lowerQuestion.includes('种类') || lowerQuestion.includes('分类'))) {
      return `桥梁结构主要分为四大类型：

🌉 **梁桥**：最简单的结构，适合短跨径
- 优点：结构简单，施工容易
- 缺点：跨径有限，承重能力相对较低

🌉 **拱桥**：美观且坚固，适合中等跨径
- 优点：承重能力强，造型美观
- 缺点：施工复杂，对地基要求高

🌉 **桁架桥**：结构稳定，适合长跨径
- 优点：材料利用率高，跨度大
- 缺点：结构复杂，维护成本高

🌉 **悬索桥**：跨度最大，技术最复杂
- 优点：跨度可达数千米
- 缺点：造价昂贵，技术要求高

对于木结构桥梁，建议从梁桥开始学习，逐步掌握更复杂的结构类型。`
    }

    // 承重计算相关
    if (lowerQuestion.includes('承重') || lowerQuestion.includes('计算')) {
      return `桥梁承重能力计算涉及多个因素：

📊 **主要影响因素**：
1. **材料强度**：不同木材的强度差异很大
2. **截面形状**：矩形、圆形、工字形等
3. **支撑方式**：简支、连续、悬臂等
4. **荷载分布**：集中荷载 vs 分布荷载

🧮 **基本计算公式**：
- 弯矩 M = P × L / 4 (简支梁中点集中荷载)
- 应力 σ = M × y / I
- 安全系数 = 材料强度 / 实际应力

💡 **实用建议**：
- 增加截面高度比增加宽度更有效
- 合理布置支撑点可显著提高承重
- 考虑材料的各向异性特性

建议先用简单模型验证理论计算，再逐步增加复杂度。`
    }

    // 设计原理相关
    if (lowerQuestion.includes('设计') && lowerQuestion.includes('原理')) {
      return `木结构桥梁设计遵循以下核心原理：

🏗️ **结构力学原理**：
1. **力的传递路径**：荷载 → 桥面 → 主梁 → 支撑 → 基础
2. **应力分布**：上弦受压，下弦受拉，腹杆传递剪力
3. **稳定性**：防止侧向失稳和扭转失稳

🌲 **材料特性考虑**：
- **顺纹强度** > **横纹强度** > **斜纹强度**
- 木材的**各向异性**特性
- **湿度**和**温度**对强度的影响

⚖️ **设计原则**：
1. **安全第一**：确保结构安全可靠
2. **经济合理**：在满足功能的前提下降低成本
3. **美观实用**：兼顾结构美和实用性
4. **施工可行**：考虑实际施工条件

🎯 **设计步骤**：
1. 确定荷载和跨度
2. 选择结构形式
3. 初步设计截面
4. 结构分析计算
5. 优化设计参数
6. 绘制施工图纸`
    }

    // 稳定性相关
    if (lowerQuestion.includes('稳定') || lowerQuestion.includes('优化')) {
      return `提高桥梁稳定性的方法：

🔧 **结构优化**：
1. **增加支撑点**：减少单跨长度
2. **加强连接**：使用更牢固的连接方式
3. **设置横撑**：防止侧向变形
4. **合理布置**：荷载尽量靠近支撑点

📐 **几何优化**：
- **高宽比**：梁高与跨度的比值要合理
- **截面形状**：工字形比矩形更经济
- **支撑角度**：斜撑角度影响传力效果

🔗 **连接优化**：
- 使用**榫卯连接**提高节点强度
- 增加**螺栓**或**钉子**数量
- 采用**胶合**技术增强连接

⚡ **动态稳定性**：
- 避免**共振**现象
- 考虑**风荷载**影响
- 设置**阻尼**装置

💡 **实用技巧**：
- 在关键节点处加强
- 使用三角形结构增加稳定性
- 考虑施工过程中的临时支撑`
    }

    // 材料选择相关
    if (lowerQuestion.includes('材料') || lowerQuestion.includes('木材') || lowerQuestion.includes('选择')) {
      return `木结构桥梁材料选择指南：

🌲 **常用木材特性**：

**松木**：
- 优点：价格便宜，易加工，重量轻
- 缺点：强度较低，易变形
- 适用：小型桥梁，学习实验

**橡木**：
- 优点：强度高，耐久性好，纹理美观
- 缺点：价格较高，加工难度大
- 适用：重要结构，长期使用

**竹材**：
- 优点：强度重量比高，韧性好，环保
- 缺点：易开裂，连接困难
- 适用：轻型结构，创新设计

**胶合板**：
- 优点：尺寸稳定，强度均匀，易加工
- 缺点：耐水性差，价格较高
- 适用：桥面板，装饰构件

📋 **选择原则**：
1. **强度要求**：根据荷载大小选择
2. **耐久性**：考虑使用环境
3. **加工性**：选择易加工的材料
4. **经济性**：平衡性能与成本
5. **环保性**：选择可持续材料`
    }

    // 荷载分析相关
    if (lowerQuestion.includes('荷载') || lowerQuestion.includes('力') || lowerQuestion.includes('压力')) {
      return `桥梁设计中的荷载分析：

⚖️ **主要荷载类型**：

**恒载（Dead Load）**：
- 桥梁自重：结构材料重量
- 附属设施：栏杆、路面、管线等
- 特点：大小和位置固定不变

**活载（Live Load）**：
- 车辆荷载：汽车、卡车重量
- 人群荷载：行人重量
- 特点：大小和位置变化

**环境荷载**：
- 风荷载：侧向风力作用
- 温度荷载：热胀冷缩效应
- 地震荷载：地震惯性力

📊 **荷载组合**：
1. **基本组合**：恒载 + 活载
2. **标准组合**：基本组合 + 风载
3. **偶然组合**：标准组合 + 地震

🔍 **分析方法**：
- **静力分析**：计算静力平衡
- **动力分析**：考虑振动效应
- **疲劳分析**：重复荷载影响

💡 **设计建议**：
- 安全系数通常取2.0-3.0
- 考虑荷载的不确定性
- 预留一定的安全余量`
    }

    // 经济分析相关
    if (lowerQuestion.includes('跨度') || lowerQuestion.includes('材料用量') || lowerQuestion.includes('经济')) {
      return `桥梁跨度与材料用量的经济分析：

📐 **跨度与材料关系**：

**梁桥**：
- 材料用量 ∝ 跨度²
- 跨径增加1倍，材料增加4倍
- 经济跨度：10-30米

**拱桥**：
- 材料用量 ∝ 跨度^1.5
- 跨径增加1倍，材料增加2.8倍
- 经济跨度：20-100米

**桁架桥**：
- 材料用量 ∝ 跨度^1.2
- 跨径增加1倍，材料增加2.3倍
- 经济跨度：30-200米

💰 **成本构成**：
1. **材料成本**：40-60%
2. **人工成本**：20-30%
3. **设备成本**：10-20%
4. **其他费用**：10-20%

📊 **优化策略**：
- **合理分跨**：避免过大单跨
- **材料选择**：平衡强度与成本
- **结构形式**：选择经济结构
- **施工方法**：降低施工成本

🎯 **经济指标**：
- 单位跨度成本（元/米）
- 材料利用率（%）
- 施工周期（天）
- 维护成本（年）`
    }

    // 施工要点相关
    if (lowerQuestion.includes('施工') || lowerQuestion.includes('建造') || lowerQuestion.includes('制作')) {
      return `桥梁施工中的关键要点：

🔨 **施工准备**：
1. **场地平整**：确保基础稳固
2. **材料准备**：检查材料质量
3. **工具准备**：锯子、钻头、胶水等
4. **安全措施**：佩戴防护用品

📏 **测量放样**：
- 使用精确测量工具
- 标记关键控制点
- 检查几何尺寸
- 确保对称性

🔗 **连接工艺**：
**榫卯连接**：
- 优点：强度高，美观
- 缺点：加工复杂
- 适用：重要节点

**螺栓连接**：
- 优点：施工简单，可拆卸
- 缺点：需要预钻孔
- 适用：临时结构

**胶合连接**：
- 优点：强度均匀，密封好
- 缺点：固化时间长
- 适用：大面积连接

⚠️ **质量控制**：
1. **材料检查**：无裂纹、无虫蛀
2. **尺寸检查**：误差控制在±2mm
3. **连接检查**：牢固可靠
4. **整体检查**：结构稳定

🚧 **安全注意事项**：
- 使用锋利工具时注意安全
- 胶水使用后及时洗手
- 保持工作区域整洁
- 遵守实验室安全规定`
    }

    // 结构力学相关
    if (lowerQuestion.includes('力') || lowerQuestion.includes('应力') || lowerQuestion.includes('弯矩') || lowerQuestion.includes('剪力')) {
      return `结构力学基础知识：

🔧 **力的基本概念**：
• **拉力**：使材料伸长的力
• **压力**：使材料压缩的力  
• **剪力**：使材料产生剪切变形的力
• **弯矩**：使材料弯曲的力矩

📐 **应力分析**：
• 应力 = 力 / 截面面积
• 安全系数 = 材料强度 / 实际应力
• 通常安全系数取2.0-3.0

💡 **实用建议**：
• 梁的上部受压，下部受拉
• 增加截面高度比增加宽度更有效
• 合理布置支撑点可减少弯矩

建议从简单的梁桥开始学习受力分析！`
    }

    // 材料科学相关
    if (lowerQuestion.includes('材料') || lowerQuestion.includes('木材') || lowerQuestion.includes('强度') || lowerQuestion.includes('弹性')) {
      return `材料科学基础知识：

🌲 **木材特性**：
• **各向异性**：顺纹强度 > 横纹强度
• **弹性模量**：材料抵抗变形的能力
• **强度**：材料能承受的最大应力
• **韧性**：材料抵抗冲击的能力

📊 **材料选择原则**：
1. **强度要求**：根据荷载大小选择
2. **刚度要求**：控制变形在允许范围内
3. **耐久性**：考虑使用环境
4. **经济性**：平衡性能与成本

🔬 **实验建议**：
• 测试不同木材的强度
• 比较不同截面形状的承载能力
• 观察材料的破坏模式`
    }

    // 设计方法相关
    if (lowerQuestion.includes('设计') || lowerQuestion.includes('方案') || lowerQuestion.includes('构思') || lowerQuestion.includes('创意')) {
      return `桥梁设计方法：

🎨 **设计流程**：
1. **需求分析**：确定跨度、荷载、环境
2. **方案构思**：提出多种设计方案
3. **结构分析**：计算受力情况
4. **优化改进**：调整设计参数
5. **施工设计**：考虑施工可行性

💡 **设计原则**：
• **安全第一**：确保结构安全可靠
• **经济合理**：在满足功能的前提下降低成本
• **美观实用**：兼顾结构美和实用性
• **施工可行**：考虑实际施工条件

🚀 **创新思维**：
• 从自然界寻找灵感
• 尝试新材料和新工艺
• 考虑环保和可持续发展`
    }

    // 实验相关
    if (lowerQuestion.includes('实验') || lowerQuestion.includes('测试') || lowerQuestion.includes('验证') || lowerQuestion.includes('制作')) {
      return `实验设计与实施：

🔬 **实验步骤**：
1. **制定计划**：明确实验目的和方法
2. **准备材料**：选择合适的材料和工具
3. **制作模型**：按照设计图纸制作
4. **加载测试**：逐步增加荷载
5. **记录数据**：测量变形和破坏荷载
6. **分析结果**：对比理论与实际

📏 **测量要点**：
• 使用精确的测量工具
• 记录关键尺寸数据
• 观察破坏过程和模式
• 拍照记录重要时刻

⚠️ **安全注意**：
• 佩戴防护用品
• 控制加载速度
• 注意观察异常情况
• 及时停止危险操作`
    }

    // 学习建议相关
    if (lowerQuestion.includes('学习') || lowerQuestion.includes('建议') || lowerQuestion.includes('方法') || lowerQuestion.includes('技巧')) {
      return `学习建议和方法：

📚 **学习策略**：
• **理论结合实践**：先学原理，再做实验
• **循序渐进**：从简单到复杂
• **多动手**：通过制作加深理解
• **多思考**：分析失败原因，总结经验

🎯 **学习重点**：
1. **结构原理**：理解力的传递路径
2. **材料特性**：掌握不同材料的特点
3. **设计方法**：学会系统化设计思维
4. **实验技能**：提高动手操作能力

💪 **提升技巧**：
• 多做练习题和设计题
• 参加设计竞赛
• 与同学交流讨论
• 关注工程案例

记住：失败是成功之母，每次失败都是学习的机会！`
    }

    // 工程案例相关
    if (lowerQuestion.includes('案例') || lowerQuestion.includes('例子') || lowerQuestion.includes('实例') || lowerQuestion.includes('著名')) {
      return `著名桥梁工程案例：

🌉 **世界著名桥梁**：
• **金门大桥**：悬索桥的经典之作
• **悉尼海港大桥**：拱桥的代表作品
• **明石海峡大桥**：世界最长的悬索桥
• **赵州桥**：中国古代石拱桥的杰作

📖 **学习价值**：
• 了解不同结构形式的特点
• 学习工程设计的创新思维
• 认识材料与结构的关系
• 体会工程与艺术的结合

🔍 **分析方法**：
• 研究桥梁的结构形式
• 分析受力特点和传力路径
• 了解施工技术和创新点
• 思考设计的优缺点

建议多研究这些经典案例，从中汲取设计灵感！`
    }

    // 数学计算相关
    if (lowerQuestion.includes('计算') || lowerQuestion.includes('公式') || lowerQuestion.includes('数学') || lowerQuestion.includes('算法')) {
      return `桥梁计算基础知识：

🧮 **基本公式**：
• **弯矩**：M = P × L / 4 (简支梁中点集中荷载)
• **应力**：σ = M × y / I
• **挠度**：f = 5PL³ / (384EI)
• **安全系数**：n = σu / σ

📐 **计算步骤**：
1. 确定荷载和跨度
2. 计算内力（弯矩、剪力）
3. 选择截面尺寸
4. 验算强度和刚度
5. 调整设计参数

💡 **计算技巧**：
• 使用单位制要统一
• 注意公式的适用条件
• 考虑安全系数
• 验证计算结果的合理性

建议先用简单例子练习计算，再逐步增加复杂度！`
    }

    // 默认回答 - 更智能的通用回答
    return `感谢您的提问！🤔

虽然您的问题可能超出了我预设的专业知识范围，但我可以尝试从桥梁工程的角度为您分析：

🔍 **建议您**：
• 将问题与桥梁工程联系起来
• 提供更具体的技术细节
• 说明您遇到的具体困难

📚 **我可以帮助您**：
• 桥梁设计原理分析
• 结构力学计算指导  
• 材料选择建议
• 实验设计方法
• 学习策略制定

💡 **或者您可以尝试**：
• 询问具体的桥梁类型
• 了解材料特性
• 学习设计方法
• 探讨实验技巧

请告诉我您具体想了解什么，我会尽力为您提供专业的解答！`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      content: inputMessage,
      isUser: true,
    }
    
    addChatMessage(userMessage)
    const currentMessage = inputMessage
    setInputMessage('')
    setIsTyping(true)

    try {
      // 调用AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      const aiResponse = data.response || getAIResponse(currentMessage)
      
      addChatMessage({
        content: aiResponse,
        isUser: false,
      })
    } catch (error) {
      console.error('AI API Error:', error)
      // 如果API调用失败，使用本地回答
      const aiResponse = getAIResponse(currentMessage)
      
      addChatMessage({
        content: aiResponse,
        isUser: false,
      })
    }
    
    setIsTyping(false)
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 获取学习建议
  const getLearningSuggestions = (): string[] => {
    const suggestions = []
    const recentMessages = chatMessages.slice(-10) // 最近10条消息
    
    // 分析用户关注的话题
    const topics = recentMessages
      .filter(msg => msg.isUser)
      .map(msg => msg.content.toLowerCase())
      .join(' ')
    
    if (topics.includes('桥梁') && topics.includes('类型')) {
      suggestions.push('建议学习不同桥梁类型的受力特点')
    }
    if (topics.includes('计算') || topics.includes('承重')) {
      suggestions.push('可以尝试设计一个简单的梁桥进行承重测试')
    }
    if (topics.includes('材料') || topics.includes('木材')) {
      suggestions.push('建议比较不同木材的强度和成本')
    }
    if (topics.includes('稳定') || topics.includes('优化')) {
      suggestions.push('可以尝试添加斜撑来提高结构稳定性')
    }
    
    // 默认建议
    if (suggestions.length === 0) {
      suggestions.push('建议从简单的梁桥设计开始学习')
      suggestions.push('可以尝试计算不同跨度的材料用量')
    }
    
    return suggestions.slice(0, 3) // 最多显示3个建议
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">智能学习助手</h2>
        <p className="text-gray-600">我可以回答您关于桥梁设计、结构力学和木结构工程的问题</p>
      </div>

      {/* 快速问题 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">快速提问</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickQuestions.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={() => handleQuickQuestion(item.text)}
                className="flex items-center space-x-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.text}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6" style={{ height: '400px', overflowY: 'auto' }}>
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">开始对话</h3>
              <p className="text-gray-500">选择上方问题或直接输入您的问题</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-3xl ${
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isUser
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-primary-600 border border-primary-200'
                    }`}
                  >
                    {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.isUser ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white text-primary-600 border border-primary-200 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="flex space-x-3">
        <div className="flex-1">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={2}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>发送</span>
        </button>
      </div>

      {/* 学习建议 */}
      {chatMessages.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-2">🎯 个性化学习建议</p>
              <ul className="space-y-1">
                {getLearningSuggestions().map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-600">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 帮助提示 */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">💡 学习提示</p>
            <p>您可以询问关于桥梁设计、结构力学、材料选择、承重计算等任何问题。我会根据您的学习进度提供个性化的解答和建议。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
