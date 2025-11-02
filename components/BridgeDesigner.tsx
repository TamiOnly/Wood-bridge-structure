'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
// import { toast } from 'react-hot-toast'
import { 
  Plus, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Upload,
  Trash2,
  Edit3
} from 'lucide-react'
import { BridgeDesign } from '@/lib/store'

export default function BridgeDesigner() {
  const { bridgeDesigns, addBridgeDesign, updateBridgeDesign, setCurrentDesign, currentDesign } = useAppStore()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'beam' as BridgeDesign['type'],
    materials: [] as string[],
    span: 0,
    height: 0,
    width: 0,
    estimatedWeight: 0,
    designImage: '',
  })

  const bridgeTypes = [
    { value: 'beam', label: '梁桥', description: '简单直接，适合短跨径' },
    { value: 'arch', label: '拱桥', description: '美观坚固，适合中等跨径' },
    { value: 'truss', label: '桁架桥', description: '结构稳定，适合长跨径' },
    { value: 'suspension', label: '悬索桥', description: '跨度最大，技术复杂' },
  ]

  const materialOptions = [
    '松木', '橡木', '竹材', '胶合板', '木条', '木棒', '木片'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('请输入桥梁名称')
      return
    }

    if (formData.materials.length === 0) {
      alert('请选择至少一种材料')
      return
    }

    if (editingId) {
      updateBridgeDesign(editingId, formData)
      alert('桥梁设计已更新')
      setEditingId(null)
    } else {
      addBridgeDesign(formData)
      alert('桥梁设计已保存')
    }

    // 重置表单
    setFormData({
      name: '',
      type: 'beam',
      materials: [],
      span: 0,
      height: 0,
      width: 0,
      estimatedWeight: 0,
      designImage: '',
    })
    setIsCreating(false)
  }

  const handleEdit = (design: BridgeDesign) => {
    setFormData({
      name: design.name,
      type: design.type,
      materials: design.materials,
      span: design.span,
      height: design.height,
      width: design.width,
      estimatedWeight: design.estimatedWeight,
      designImage: design.designImage || '',
    })
    setEditingId(design.id)
    setIsCreating(true)
  }

  const calculateFeasibilityScore = (design: BridgeDesign): number => {
    let score = 0
    
    // 基础分数
    score += 20
    
    // 材料选择评分
    if (design.materials.includes('松木')) score += 15
    if (design.materials.includes('橡木')) score += 20
    if (design.materials.includes('竹材')) score += 10
    
    // 结构类型评分
    switch (design.type) {
      case 'beam':
        score += design.span <= 50 ? 20 : 10
        break
      case 'arch':
        score += design.span <= 100 ? 25 : 15
        break
      case 'truss':
        score += design.span <= 150 ? 30 : 20
        break
      case 'suspension':
        score += design.span > 100 ? 25 : 10
        break
    }
    
    // 尺寸合理性评分
    if (design.height > 0 && design.width > 0) {
      const aspectRatio = design.height / design.width
      if (aspectRatio >= 0.1 && aspectRatio <= 0.5) score += 15
    }
    
    return Math.min(score, 100)
  }

  const getFeasibilityLevel = (score: number) => {
    if (score >= 80) return { level: '优秀', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 60) return { level: '良好', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 40) return { level: '一般', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: '需改进', color: 'text-red-600', bg: 'bg-red-100' }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">桥梁设计方案</h2>
          <p className="text-gray-600">设计您的桥梁结构，系统将评估方案的可行性</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>新建设计</span>
        </button>
      </div>

      {/* 设计表单 */}
      {isCreating && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? '编辑设计' : '新建桥梁设计'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  桥梁名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="例如：我的第一座桥"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  桥梁类型
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as BridgeDesign['type'] }))}
                  className="input-field"
                >
                  {bridgeTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                使用材料
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {materialOptions.map(material => (
                  <label key={material} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.materials.includes(material)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, materials: [...prev.materials, material] }))
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            materials: prev.materials.filter(m => m !== material) 
                          }))
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{material}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  跨径 (cm)
                </label>
                <input
                  type="number"
                  value={formData.span}
                  onChange={(e) => setFormData(prev => ({ ...prev, span: Number(e.target.value) }))}
                  className="input-field"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  高度 (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="input-field"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  宽度 (cm)
                </label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData(prev => ({ ...prev, width: Number(e.target.value) }))}
                  className="input-field"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预估重量 (g)
                </label>
                <input
                  type="number"
                  value={formData.estimatedWeight}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedWeight: Number(e.target.value) }))}
                  className="input-field"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false)
                  setEditingId(null)
                  setFormData({
                    name: '',
                    type: 'beam',
                    materials: [],
                    span: 0,
                    height: 0,
                    width: 0,
                    estimatedWeight: 0,
                    designImage: '',
                  })
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? '更新' : '保存'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 设计列表 */}
      <div className="space-y-4">
        {bridgeDesigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">还没有桥梁设计</h3>
            <p className="text-gray-500 mb-4">点击&quot;新建设计&quot;开始您的第一个桥梁设计</p>
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary"
            >
              开始设计
            </button>
          </div>
        ) : (
          bridgeDesigns.map((design) => {
            const score = calculateFeasibilityScore(design)
            const feasibility = getFeasibilityLevel(score)
            
            return (
              <div key={design.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {design.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {bridgeTypes.find(t => t.value === design.type)?.label} • 
                      跨径: {design.span}cm • 
                      材料: {design.materials.join(', ')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${feasibility.bg} ${feasibility.color}`}>
                      {feasibility.level} ({score}分)
                    </div>
                    <button
                      onClick={() => handleEdit(design)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{design.span}</div>
                    <div className="text-sm text-gray-500">跨径(cm)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{design.height}</div>
                    <div className="text-sm text-gray-500">高度(cm)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{design.width}</div>
                    <div className="text-sm text-gray-500">宽度(cm)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{design.estimatedWeight}</div>
                    <div className="text-sm text-gray-500">重量(g)</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>创建时间: {design.createdAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentDesign(design)}
                      className="btn-secondary text-sm"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
