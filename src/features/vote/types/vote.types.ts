export interface JoinParticipantRequest {
  meetingRoomId: string
  username?: string
  password?: string
}

export interface ParticipantResponse {
  participantId: string
  username: string
}

export interface AvailabilityTimeRequest {
  date: string
  timeSlots: string[]
}

export interface SubmitTimeRequest {
  participantId: string
  availabilityTimeRequests: AvailabilityTimeRequest[]
}
