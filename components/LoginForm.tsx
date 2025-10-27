'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
// import { toast } from 'react-hot-toast'
// import { User, GraduationCap, BookOpen } from 'lucide-react'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    studentId: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const { setUser } = useAppStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 模拟登录验证
    if (!formData.name || !formData.class || !formData.studentId) {
      alert('请填写完整信息')
      setIsLoading(false)
      return
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user = {
        id: Date.now().toString(),
        name: formData.name,
        class: formData.class,
        studentId: formData.studentId,
      }
      
      setUser(user)
      alert(`欢迎回来，${formData.name}！`)
      router.push('/dashboard')
    } catch (error) {
      alert('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="card">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <span className="text-3xl">🎓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">学生登录</h2>
        <p className="text-gray-600">请输入您的学习信息</p>
      </div>

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
              className="input-field pl-10"
              placeholder="请输入您的姓名"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
            班级
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📚</span>
            <input
              type="text"
              id="class"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="例如：高一(1)班"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
            学号
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            className="input-field"
            placeholder="请输入您的学号"
            required
          />
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
          登录即表示您同意使用本学习平台
        </p>
      </div>
    </div>
  )
}
