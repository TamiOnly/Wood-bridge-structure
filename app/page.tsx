'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import LoginForm from '@/components/LoginForm'

export default function Home() {
  const { isLoggedIn, user } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    // 检查登录状态，同时验证用户数据是否完整（防止旧数据导致自动跳转）
    if (isLoggedIn && user) {
      // 验证用户数据完整性（新的数据结构需要包含这些字段）
      if (user.name && user.groupName && user.grade && user.role === '组长') {
        router.push('/dashboard')
      } else {
        // 如果用户数据不完整，清除登录状态
        useAppStore.getState().logout()
      }
    }
  }, [isLoggedIn, user, router])

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            神奇木结构
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            STEM桥梁设计与承重学习平台
          </p>
          <p className="text-gray-500">
            探索桥梁工程，掌握结构力学，体验STEM教育的魅力
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
