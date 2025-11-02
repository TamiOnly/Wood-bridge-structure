import { NextRequest, NextResponse } from 'next/server'
import { getGroupMembers } from '@/lib/students'
import { ensureDatabaseInitialized } from '@/lib/db'

// 获取指定组的所有成员
export async function GET(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  await ensureDatabaseInitialized()
  try {
    const groupName = decodeURIComponent(params.groupId)
    const members = await getGroupMembers(groupName)
    
    // 移除密码字段
    const membersWithoutPassword = members.map(({ groupPassword, ...member }) => member)
    
    return NextResponse.json({
      success: true,
      members: membersWithoutPassword,
    })
  } catch (error) {
    console.error('Get group members error:', error)
    return NextResponse.json(
      { error: '获取组成员失败' },
      { status: 500 }
    )
  }
}

