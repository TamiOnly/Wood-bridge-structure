import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  grade: string
  studentId: string
  gender: '男' | '女'
  role: '组长' | '组员'
  groupName: string
  avatar?: string
}

export interface BridgeDesign {
  id: string
  name: string
  type: 'beam' | 'arch' | 'truss' | 'suspension'
  materials: string[]
  span: number
  height: number
  width: number
  estimatedWeight: number
  designImage?: string
  feasibilityScore?: number
  createdAt: Date
}

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export interface LearningProgress {
  id: string
  userId: string
  beforeImage?: string
  afterImage?: string
  improvementScore?: number
  notes?: string
  createdAt: Date
}

interface AppState {
  // 用户状态
  user: User | null
  isLoggedIn: boolean
  
  // 桥梁设计
  bridgeDesigns: BridgeDesign[]
  currentDesign: BridgeDesign | null
  
  // 聊天
  chatMessages: ChatMessage[]
  
  // 学习进度
  learningProgress: LearningProgress[]
  
  // 操作
  setUser: (user: User) => void
  logout: () => void
  addBridgeDesign: (design: Omit<BridgeDesign, 'id' | 'createdAt'>) => void
  updateBridgeDesign: (id: string, updates: Partial<BridgeDesign>) => void
  setCurrentDesign: (design: BridgeDesign | null) => void
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  addLearningProgress: (progress: Omit<LearningProgress, 'id' | 'createdAt'>) => void
  updateLearningProgress: (id: string, updates: Partial<LearningProgress>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isLoggedIn: false,
      bridgeDesigns: [],
      currentDesign: null,
      chatMessages: [],
      learningProgress: [],
      
      // 用户操作
      setUser: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      
      // 桥梁设计操作
      addBridgeDesign: (design) => {
        const newDesign: BridgeDesign = {
          ...design,
          id: Date.now().toString(),
          createdAt: new Date(),
        }
        set((state) => ({
          bridgeDesigns: [...state.bridgeDesigns, newDesign],
        }))
      },
      
      updateBridgeDesign: (id, updates) => {
        set((state) => ({
          bridgeDesigns: state.bridgeDesigns.map((design) =>
            design.id === id ? { ...design, ...updates } : design
          ),
        }))
      },
      
      setCurrentDesign: (design) => set({ currentDesign: design }),
      
      // 聊天操作
      addChatMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        }
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage],
        }))
      },
      
      // 学习进度操作
      addLearningProgress: (progress) => {
        const newProgress: LearningProgress = {
          ...progress,
          id: Date.now().toString(),
          createdAt: new Date(),
        }
        set((state) => ({
          learningProgress: [...state.learningProgress, newProgress],
        }))
      },
      
      updateLearningProgress: (id, updates) => {
        set((state) => ({
          learningProgress: state.learningProgress.map((progress) =>
            progress.id === id ? { ...progress, ...updates } : progress
          ),
        }))
      },
    }),
    {
      name: 'magic-wood-structure-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        bridgeDesigns: state.bridgeDesigns,
        learningProgress: state.learningProgress,
      }),
    }
  )
)
