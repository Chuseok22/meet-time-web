import { useMutation, useQueryClient } from '@tanstack/react-query'
import { joinParticipant, deleteParticipant } from '@/features/vote/api/participantApi'
import { submitTime } from '@/features/vote/api/timeApi'
import { roomKeys } from '@/features/room/hooks/useRoom'
import type { JoinParticipantRequest, SubmitTimeRequest } from '@/features/vote/types/vote.types'

export function useJoinParticipant() {
  return useMutation({
    mutationFn: (body: JoinParticipantRequest) => joinParticipant(body),
  })
}

export function useSubmitTime(roomId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: SubmitTimeRequest) => submitTime(body),
    onSuccess: () => {
      /* 투표 완료 후 방 데이터 재조회 */
      queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) })
    },
  })
}

export function useDeleteParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (participantId: string) => deleteParticipant(participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.myRooms() })
    },
  })
}
