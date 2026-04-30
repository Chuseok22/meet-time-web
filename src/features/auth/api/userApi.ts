import apiClient from '@/shared/api/apiClient'
import type { UserInfo } from '@/features/auth/types/auth.types'

export async function getMe(): Promise<UserInfo> {
  const { data } = await apiClient.get<UserInfo>('/api/users/me')
  return data
}
