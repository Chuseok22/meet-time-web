import apiClient from '@/shared/api/apiClient'
import type { Room, CreateRoomRequest, MyRoom } from '@/features/room/types/room.types'

export async function createRoom(body: CreateRoomRequest): Promise<Room> {
  const { data } = await apiClient.post<Room>('/api/rooms', body)
  return data
}

export async function getRoomById(roomId: string): Promise<Room> {
  const { data } = await apiClient.get<Room>(`/api/rooms/${roomId}`)
  return data
}

export async function getRoomByJoinCode(joinCode: string): Promise<Room> {
  const { data } = await apiClient.get<Room>(`/api/rooms/join-code/${joinCode}`)
  return data
}

export async function deleteRoom(roomId: string): Promise<void> {
  await apiClient.delete(`/api/rooms/${roomId}`)
}

export async function getMyRooms(): Promise<MyRoom[]> {
  const { data } = await apiClient.get<MyRoom[]>('/api/users/me/rooms')
  return data
}
