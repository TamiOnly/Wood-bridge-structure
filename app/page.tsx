'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import LoginForm from '@/components/LoginForm'

export default function Home() {
  const { isLoggedIn } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    // 检查登录状态
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }, [isLoggedIn, router])

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
