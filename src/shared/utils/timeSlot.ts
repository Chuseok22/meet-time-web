const START_HOUR = 8

/* slotIndex → "SLOT_09_00" */
export function slotIndexToCode(slotIndex: number): string {
  const totalMin = START_HOUR * 60 + slotIndex * 30
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `SLOT_${String(h).padStart(2, '0')}_${String(m).padStart(2, '0')}`
}

/* "SLOT_09_00" → slotIndex */
export function slotCodeToIndex(code: string): number {
  const [, hStr, mStr] = code.split('_')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  return (h * 60 + m - START_HOUR * 60) / 30
}

/* 선택된 슬롯 Set (dateKey__slotIndex) → API 요청 형식 변환 */
export function selectedSlotsToRequest(
  selected: Set<string>,
  dates: string[],
): Array<{ date: string; timeSlots: string[] }> {
  const map = new Map<string, string[]>()

  /* 방의 모든 날짜를 빈 배열로 초기화 (선택 안 한 날짜도 포함해야 기존 데이터 삭제됨) */
  dates.forEach(d => map.set(d, []))

  selected.forEach(key => {
    const [dateKey, slotStr] = key.split('__')
    const slotIndex = parseInt(slotStr, 10)
    const code = slotIndexToCode(slotIndex)
    const existing = map.get(dateKey)
    if (existing !== undefined) {
      existing.push(code)
    }
  })

  return Array.from(map.entries()).map(([date, timeSlots]) => ({ date, timeSlots }))
}

/* API 응답 → 선택된 슬롯 Set 복원 */
export function responseToSelectedSlots(
  dateAvailability: Array<{
    date: string
    timeSlotParticipantsResponses: Array<{
      timeSlot: string
      participantInfoResponses: Array<{ participantId: string }>
    }>
  }>,
  participantId: string,
): Set<string> {
  const result = new Set<string>()

  dateAvailability.forEach(({ date, timeSlotParticipantsResponses }) => {
    timeSlotParticipantsResponses.forEach(({ timeSlot, participantInfoResponses }) => {
      const isMe = participantInfoResponses.some(p => p.participantId === participantId)
      if (isMe) {
        result.add(`${date}__${slotCodeToIndex(timeSlot)}`)
      }
    })
  })

  return result
}
