'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { 
  Building2, 
  MessageCircle, 
  Camera, 
  User, 
  LogOut,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react'
import BridgeDesigner from './BridgeDesigner'
import ChatInterface from './ChatInterface'
import LearningProgress from './LearningProgress'

export default function MainDashboard() {
  const [activeTab, setActiveTab] = useState<'design' | 'chat' | 'progress'>('design')
  const { user, logout } = useAppStore()

  const tabs = [
    {
      id: 'design' as const,
      name: '桥梁设计',
      icon: Building2,
      description: '设计并评估桥梁方案'
    },
    {
      id: 'chat' as const,
      name: '智能问答',
      icon: MessageCircle,
      description: '实时解答学习问题'
    },
    {
      id: 'progress' as const,
      name: '学习评估',
      icon: Camera,
      description: '前后对比学习效果'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gradient">神奇木结构</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
                <span className="text-gray-400">|</span>
                <span>{user?.class}</span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>退出</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  欢迎回来，{user?.name}！
                </h2>
                <p className="text-gray-600 mb-4">
                  今天我们来学习桥梁结构设计，探索木结构的奥秘
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>课程：神奇木结构</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>学习进度：进行中</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                  <Award className="w-12 h-12 text-primary-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 功能导航 */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 bg-primary-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                      activeTab === tab.id ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        activeTab === tab.id ? 'text-primary-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className={`font-semibold mb-2 ${
                      activeTab === tab.id ? 'text-primary-700' : 'text-gray-900'
                    }`}>
                      {tab.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tab.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="bg-white rounded-xl shadow-soft">
          {activeTab === 'design' && <BridgeDesigner />}
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'progress' && <LearningProgress />}
        </div>
      </div>
    </div>
  )
}
