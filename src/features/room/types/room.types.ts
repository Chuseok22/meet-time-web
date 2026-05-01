export interface ParticipantInfo {
  participantId: string
  username: string
}

export interface TimeSlotParticipants {
  timeSlot: string
  participantInfoResponses: ParticipantInfo[]
  availabilityCount: number
}

export interface DateAvailability {
  date: string
  timeSlotParticipantsResponses: TimeSlotParticipants[]
}

export interface Room {
  meetingRoomId: string
  title: string
  joinCode: string
  dates: string[]
  participantsCount: number
  participantInfoResponses: ParticipantInfo[]
  dateAvailabilityResponses: DateAvailability[]
}

export interface CreateRoomRequest {
  title: string
  dates: string[]
}

/* 내 방 목록 조회 응답 (로그인 사용자) */
export interface MyRoom {
  roomId: string
  title: string
  joinCode: string
  isOwner: boolean
}
