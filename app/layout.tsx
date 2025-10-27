import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '神奇木结构 - STEM桥梁学习平台',
  description: '专为高中生设计的桥梁设计与承重学习APP，提供方案评估、实时问答和学习效果分析功能',
  keywords: ['STEM教育', '桥梁设计', '木结构', '承重实验', '高中科创'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
