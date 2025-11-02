// 硬编码的学生数据（仅组长）
// 用于在 Vercel 等无数据库环境中进行登录验证

export interface HardcodedStudent {
  id: number
  name: string
  grade: string
  studentId: string
  gender: '男' | '女'
  role: '组长'
  groupName: string
  groupPassword: string
}

// 从 data/students.json 中提取的所有组长数据
export const HARDCODED_LEADERS: HardcodedStudent[] = [
  {
    id: 1,
    name: '邓紫烨',
    grade: '高二',
    studentId: '0307',
    gender: '女',
    role: '组长',
    groupName: '337',
    groupPassword: '0307',
  },
  {
    id: 3,
    name: '陈熙',
    grade: '高二',
    studentId: '0104',
    gender: '男',
    role: '组长',
    groupName: '爱日晖',
    groupPassword: '0104',
  },
  {
    id: 6,
    name: '李子流',
    grade: '高二',
    studentId: '1020',
    gender: '女',
    role: '组长',
    groupName: '欢乐斗地主',
    groupPassword: '1020',
  },
  {
    id: 8,
    name: '车嘉禾',
    grade: '高二',
    studentId: '0101',
    gender: '男',
    role: '组长',
    groupName: '爱日军',
    groupPassword: '0101',
  },
  {
    id: 11,
    name: '何皆莹',
    grade: '高二',
    studentId: '0911',
    gender: '女',
    role: '组长',
    groupName: '光宗耀祖',
    groupPassword: '0911',
  },
  {
    id: 13,
    name: '盛涵',
    grade: '高二',
    studentId: '0439',
    gender: '男',
    role: '组长',
    groupName: '吴彦组',
    groupPassword: '0439',
  },
  {
    id: 15,
    name: '李浩嘉',
    grade: '高二',
    studentId: '0816',
    gender: '男',
    role: '组长',
    groupName: 'BS',
    groupPassword: '0816',
  },
  {
    id: 18,
    name: '鲍灏',
    grade: '高二',
    studentId: '0401',
    gender: '男',
    role: '组长',
    groupName: '冰红茶组',
    groupPassword: '0401',
  },
  {
    id: 22,
    name: '谢安翘',
    grade: '高二',
    studentId: '0235',
    gender: '女',
    role: '组长',
    groupName: '人民当家作组',
    groupPassword: '0235',
  },
  {
    id: 23,
    name: '孔雅雯',
    grade: '高二',
    studentId: '1018',
    gender: '女',
    role: '组长',
    groupName: '烤鱼',
    groupPassword: '1018',
  },
]

/**
 * 验证组长登录（硬编码版本，不依赖数据库）
 * @param name 姓名
 * @param groupName 组名
 * @param password 密码
 * @returns 学生信息，如果验证失败返回 null
 */
export function verifyLeaderLoginHardcoded(
  name: string,
  groupName: string,
  password: string
): HardcodedStudent | null {
  // 查找匹配的组长
  const leader = HARDCODED_LEADERS.find(
    (l) =>
      l.name === name &&
      l.groupName === groupName &&
      l.role === '组长' &&
      l.groupPassword === password
  )

  return leader || null
}

/**
 * 根据组名获取所有成员（硬编码版本）
 * 注意：这里只返回组长，如果需要所有成员，需要扩展 HARDCODED_LEADERS 数据
 */
export function getGroupMembersHardcoded(groupName: string): HardcodedStudent[] {
  return HARDCODED_LEADERS.filter((leader) => leader.groupName === groupName)
}

