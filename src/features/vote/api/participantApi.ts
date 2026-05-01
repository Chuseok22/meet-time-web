import apiClient from '@/shared/api/apiClient'
import type { JoinParticipantRequest, ParticipantResponse } from '@/features/vote/types/vote.types'

export async function joinParticipant(body: JoinParticipantRequest): Promise<ParticipantResponse> {
  const { data } = await apiClient.post<ParticipantResponse>('/api/participant', body)
  return data
}

export async function getParticipant(participantId: string): Promise<ParticipantResponse> {
  const { data } = await apiClient.get<ParticipantResponse>(`/api/participant/${participantId}`)
  return data
}

export async function deleteParticipant(participantId: string): Promise<void> {
  await apiClient.delete(`/api/participant/${participantId}`)
}
