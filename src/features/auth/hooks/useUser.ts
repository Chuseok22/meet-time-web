import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/features/auth/api/userApi'
import { tokenStorage } from '@/shared/api/apiClient'

export const userKeys = {
  me: ['users', 'me'] as const,
}

export function useMe() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: getMe,
    enabled: tokenStorage.get() !== null,
    staleTime: 1000 * 60 * 10,
    retry: false,
  })
}
