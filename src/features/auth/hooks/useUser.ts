import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMe, deleteMe } from '@/features/auth/api/userApi'
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

export function useDeleteMe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      tokenStorage.remove()
      queryClient.clear()
    },
  })
}
