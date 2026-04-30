import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createRoom, getRoomById, getRoomByJoinCode, deleteRoom, getMyRooms } from '@/features/room/api/roomApi'
import type { CreateRoomRequest } from '@/features/room/types/room.types'

export const roomKeys = {
  all: ['rooms'] as const,
  detail: (id: string) => ['rooms', id] as const,
  joinCode: (code: string) => ['rooms', 'join-code', code] as const,
  myRooms: () => ['rooms', 'my'] as const,
}

export function useRoom(roomId: string) {
  return useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: () => getRoomById(roomId),
    enabled: !!roomId,
    staleTime: 1000 * 30,  /* 30초 — 투표 결과 자주 갱신 */
  })
}

export function useRoomByJoinCode(joinCode: string, enabled = true) {
  return useQuery({
    queryKey: roomKeys.joinCode(joinCode),
    queryFn: () => getRoomByJoinCode(joinCode),
    enabled: enabled && joinCode.length >= 5,
    retry: false,
  })
}

export function useCreateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateRoomRequest) => createRoom(body),
    onSuccess: data => {
      queryClient.setQueryData(roomKeys.detail(data.meetingRoomId), data)
    },
  })
}

export function useDeleteRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: (_data, roomId) => {
      queryClient.removeQueries({ queryKey: roomKeys.detail(roomId) })
      queryClient.invalidateQueries({ queryKey: roomKeys.myRooms() })
    },
  })
}

export function useMyRooms() {
  return useQuery({
    queryKey: roomKeys.myRooms(),
    queryFn: getMyRooms,
    staleTime: 1000 * 60,
  })
}
