import apiClient from '@/shared/api/apiClient'
import type { UserInfo, FirebaseGoogleLoginResponse } from '@/features/auth/types/auth.types'

export async function getMe(): Promise<UserInfo> {
  const { data } = await apiClient.get<UserInfo>('/api/users/me')
  return data
}

export async function deleteMe(): Promise<void> {
  await apiClient.delete('/api/users/me')
}

export async function loginWithFirebaseGoogle(firebaseIdToken: string): Promise<FirebaseGoogleLoginResponse> {
  const { data } = await apiClient.post<FirebaseGoogleLoginResponse>('/api/auth/firebase/google', { firebaseIdToken })
  return data
}
