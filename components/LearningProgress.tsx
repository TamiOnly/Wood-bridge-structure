'use client'

import { useState, useRef } from 'react'
import { useAppStore } from '@/lib/store'
// import { toast } from 'react-hot-toast'
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Download,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
// import { useDropzone } from 'react-dropzone'

export default function LearningProgress() {
  const { learningProgress, addLearningProgress, updateLearningProgress, user } = useAppStore()
  const [isUploading, setIsUploading] = useState(false)
  const [currentProgress, setCurrentProgress] = useState<any>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  // 图片上传处理
  const onDrop = async (acceptedFiles: File[], type: 'before' | 'after') => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setIsUploading(true)

    try {
      // 模拟图片上传
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const imageUrl = URL.createObjectURL(file)
      
      if (type === 'before') {
        if (currentProgress) {
          updateLearningProgress(currentProgress.id, { beforeImage: imageUrl })
        } else {
          const newProgress = {
            userId: user?.id || '',
            beforeImage: imageUrl,
            afterImage: '',
          }
          addLearningProgress(newProgress)
          setCurrentProgress({ ...newProgress, id: Date.now().toString() })
        }
        alert('课前图片上传成功')
      } else {
        if (currentProgress) {
          updateLearningProgress(currentProgress.id, { afterImage: imageUrl })
          setCurrentProgress({ ...currentProgress, afterImage: imageUrl })
          alert('课后图片上传成功')
          
          // 自动分析学习效果
          setTimeout(() => {
            analyzeLearningEffect(currentProgress.id, imageUrl)
          }, 1000)
        } else {
          alert('请先上传课前图片')
        }
      }
    } catch (error) {
      alert('图片上传失败')
    } finally {
      setIsUploading(false)
    }
  }

  // 临时禁用 dropzone 功能，等待依赖安装
  const beforeDropzone = {
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false
  }

  const afterDropzone = {
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false
  }

  // 学习效果分析
  const analyzeLearningEffect = (progressId: string, afterImage: string) => {
    // 模拟AI分析过程
    const analysisResults = {
      improvementScore: Math.floor(Math.random() * 40) + 60, // 60-100分
      improvements: [
        '结构设计更加合理',
        '材料使用更加科学',
        '连接方式有所改进',
        '整体稳定性提升'
      ],
      suggestions: [
        '可以尝试更复杂的结构形式',
        '注意细节处理的完善',
        '考虑增加装饰性元素'
      ],
      notes: '通过对比分析，学生在桥梁设计方面有了显著进步，特别是在结构力学理解和材料运用方面。建议继续深入学习桁架结构设计。'
    }

    updateLearningProgress(progressId, {
      improvementScore: analysisResults.improvementScore,
      notes: analysisResults.notes
    })

    setShowAnalysis(true)
    alert('学习效果分析完成！')
  }

  // 获取学习等级
  const getLearningLevel = (score: number) => {
    if (score >= 90) return { level: '优秀', color: 'text-green-600', bg: 'bg-green-100', icon: Award }
    if (score >= 80) return { level: '良好', color: 'text-blue-600', bg: 'bg-blue-100', icon: TrendingUp }
    if (score >= 70) return { level: '进步', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Target }
    return { level: '继续努力', color: 'text-orange-600', bg: 'bg-orange-100', icon: BookOpen }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">学习效果评估</h2>
        <p className="text-gray-600">上传您课程前后的建桥作品，系统将分析您的学习进步</p>
      </div>

      {/* 上传区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 课前作品 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
            课程前作品
          </h3>
          
          <div
            {...beforeDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              beforeDropzone.isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            <input {...beforeDropzone.getInputProps()} />
            
            {currentProgress?.beforeImage ? (
              <div className="space-y-3">
                <img
                  src={currentProgress.beforeImage}
                  alt="课前作品"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm text-green-600 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  已上传课前作品
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    updateLearningProgress(currentProgress.id, { beforeImage: '' })
                    setCurrentProgress({ ...currentProgress, beforeImage: '' })
                  }}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  删除图片
                </button>
              </div>
            ) : (
              <div>
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">
                  {beforeDropzone.isDragActive ? '松开鼠标上传' : '点击或拖拽上传图片'}
                </p>
                <p className="text-sm text-gray-500">
                  支持 JPG、PNG、GIF 格式
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 课后作品 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 text-green-600 mr-2" />
            课程后作品
          </h3>
          
          <div
            {...afterDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              afterDropzone.isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400'
            } ${!currentProgress?.beforeImage ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...afterDropzone.getInputProps()} disabled={!currentProgress?.beforeImage} />
            
            {currentProgress?.afterImage ? (
              <div className="space-y-3">
                <img
                  src={currentProgress.afterImage}
                  alt="课后作品"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm text-green-600 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  已上传课后作品
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    updateLearningProgress(currentProgress.id, { afterImage: '' })
                    setCurrentProgress({ ...currentProgress, afterImage: '' })
                  }}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  删除图片
                </button>
              </div>
            ) : (
              <div>
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">
                  {!currentProgress?.beforeImage 
                    ? '请先上传课前作品' 
                    : afterDropzone.isDragActive 
                    ? '松开鼠标上传' 
                    : '点击或拖拽上传图片'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  支持 JPG、PNG、GIF 格式
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 分析结果 */}
      {showAnalysis && currentProgress?.improvementScore && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
            学习效果分析
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 进步评分 */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {currentProgress.improvementScore}
              </div>
              <div className="text-sm text-gray-500 mb-3">进步评分</div>
              {(() => {
                const level = getLearningLevel(currentProgress.improvementScore)
                const Icon = level.icon
                return (
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${level.bg} ${level.color}`}>
                    <Icon className="w-4 h-4 mr-1" />
                    {level.level}
                  </div>
                )
              })()}
            </div>

            {/* 改进方面 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">主要改进</h4>
              <ul className="space-y-2">
                {[
                  '结构设计更加合理',
                  '材料使用更加科学',
                  '连接方式有所改进',
                  '整体稳定性提升'
                ].map((improvement, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>

            {/* 学习建议 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">学习建议</h4>
              <ul className="space-y-2">
                {[
                  '可以尝试更复杂的结构形式',
                  '注意细节处理的完善',
                  '考虑增加装饰性元素'
                ].map((suggestion, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {currentProgress.notes && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">详细评价</h4>
              <p className="text-sm text-blue-800">{currentProgress.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* 历史记录 */}
      {learningProgress.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">学习记录</h3>
          <div className="space-y-4">
            {learningProgress.map((progress) => (
              <div key={progress.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      {progress.createdAt.toLocaleDateString()}
                    </div>
                    {progress.improvementScore && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getLearningLevel(progress.improvementScore).bg
                      } ${
                        getLearningLevel(progress.improvementScore).color
                      }`}>
                        {progress.improvementScore}分
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {progress.beforeImage && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">课前作品</p>
                      <img
                        src={progress.beforeImage}
                        alt="课前作品"
                        className="w-full h-24 object-cover rounded border"
                      />
                    </div>
                  )}
                  {progress.afterImage && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">课后作品</p>
                      <img
                        src={progress.afterImage}
                        alt="课后作品"
                        className="w-full h-24 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">📋 使用说明</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 请先上传课程前的建桥作品照片</li>
          <li>• 完成课程学习后，上传改进后的作品照片</li>
          <li>• 系统将自动分析您的学习进步情况</li>
          <li>• 建议拍摄清晰、完整的作品照片</li>
        </ul>
      </div>
    </div>
  )
}
