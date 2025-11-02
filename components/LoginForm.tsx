'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
// import { toast } from 'react-hot-toast'
// import { User, GraduationCap, BookOpen } from 'lucide-react'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    name: '',
    groupName: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { setUser } = useAppStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // 验证必填字段
    if (!formData.name || !formData.groupName || !formData.password) {
      setError('请填写完整信息（姓名、组名、密码）')
      setIsLoading(false)
      return
    }

    try {
      // 调用登录API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          groupName: formData.groupName,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '登录失败，请重试')
        setIsLoading(false)
        return
      }

      if (data.success && data.student) {
        // 转换数据库ID为字符串
        const user = {
          ...data.student,
          id: data.student.id.toString(),
        }
        
        setUser(user)
        router.push('/dashboard')
      } else {
        setError('登录失败，请重试')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('登录时发生错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // 清除错误信息
    if (error) {
      setError('')
    }
  }

  // 防止在输入框中按回车键时意外提交表单
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 只有在所有字段都填写完整时才允许回车提交
      if (!formData.name || !formData.groupName || !formData.password) {
        e.preventDefault()
        setError('请填写完整信息（姓名、组名、密码）')
      }
    }
  }

  return (
    <div className="card">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <span className="text-3xl">🎓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">组长登录</h2>
        <p className="text-gray-600">仅组长可登录，请输入您的登录信息</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            姓名
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="input-field pl-10"
              placeholder="请输入您的姓名"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
            组名
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👥</span>
            <input
              type="text"
              id="groupName"
              name="groupName"
              value={formData.groupName}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="input-field pl-10"
              placeholder="请输入您的小组名称"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            小组密码
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="input-field pl-10"
              placeholder="请输入小组密码"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '登录中...' : '开始学习'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          仅组长可以登录此系统
        </p>
      </div>
    </div>
  )
}
