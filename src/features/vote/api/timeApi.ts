import apiClient from '@/shared/api/apiClient'
import type { SubmitTimeRequest } from '@/features/vote/types/vote.types'

export async function submitTime(body: SubmitTimeRequest): Promise<void> {
  await apiClient.post('/api/time', body)
}
