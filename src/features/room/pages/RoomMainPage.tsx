import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageLayout from '@/shared/components/ui/PageLayout'
import { useRoom } from '@/features/room/hooks/useRoom'
import { slotCodeToIndex } from '@/shared/utils/timeSlot'
import type { DateAvailability } from '@/features/room/types/room.types'
import styles from './RoomMainPage.module.css'

/* ── 상수 ── */
const START_HOUR = 8
const SLOTS_PER_DAY = (24 - START_HOUR) * 2
const WEEKDAY_SHORT = ['일', '월', '화', '수', '목', '금', '토']
const TOP_N = 5

/* ── 유틸 ── */
const formatSlotTime = (slot: number) => {
  const totalMin = START_HOUR * 60 + slot * 30
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const formatDateLabel = (key: string) => {
  const [yStr, mStr, dStr] = key.split('-')
  const date = new Date(Number(yStr), Number(mStr) - 1, Number(dStr))
  return `${Number(mStr)}/${Number(dStr)} (${WEEKDAY_SHORT[date.getDay()]})`
}

const isHourBoundary = (slot: number) => (slot * 30) % 60 === 0

const slotLabel = (slot: number) => {
  const totalMin = START_HOUR * 60 + slot * 30
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (m !== 0) return ''
  return `${h}:00`
}

const getLevelFromCount = (count: number, max: number): number => {
  if (count === 0 || max === 0) return 0
  const ratio = count / max
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

/* dateAvailabilityResponses → {dateKey__slotIndex → count} Map 변환 */
function buildVoteMap(dateAvailability: DateAvailability[]): Map<string, number> {
  const map = new Map<string, number>()
  dateAvailability.forEach(({ date, timeSlotParticipantsResponses }) => {
    timeSlotParticipantsResponses.forEach(({ timeSlot, availabilityCount }) => {
      const slotIndex = slotCodeToIndex(timeSlot)
      map.set(`${date}__${slotIndex}`, availabilityCount)
    })
  })
  return map
}

/* 상위 N개 슬롯 추출 */
function getTopSlots(dateAvailability: DateAvailability[], n: number) {
  const all: Array<{ dateKey: string; slot: number; count: number }> = []
  dateAvailability.forEach(({ date, timeSlotParticipantsResponses }) => {
    timeSlotParticipantsResponses.forEach(({ timeSlot, availabilityCount }) => {
      all.push({ dateKey: date, slot: slotCodeToIndex(timeSlot), count: availabilityCount })
    })
  })
  return all.sort((a, b) => b.count - a.count).slice(0, n)
}

export default function RoomMainPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const { data: room, isLoading, error } = useRoom(roomId!)

  const handleCopy = async () => {
    if (!room) return
    try {
      await navigator.clipboard.writeText(room.joinCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* 클립보드 미지원 폴백 없음 */
    }
  }

  const handleVote = () => navigate(`/vote/${roomId}/entry`)

  if (isLoading) {
    return (
      <PageLayout showBack>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          불러오는 중…
        </div>
      </PageLayout>
    )
  }

  if (error || !room) {
    return (
      <PageLayout showBack>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)', color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
          방 정보를 불러올 수 없어요.
        </div>
      </PageLayout>
    )
  }

  const voteMap = buildVoteMap(room.dateAvailabilityResponses)
  const maxVote = Math.max(0, ...Array.from(voteMap.values()))
  const topSlots = getTopSlots(room.dateAvailabilityResponses, TOP_N)

  return (
    <PageLayout showBack onBack={() => navigate('/select')}>
      <div className={styles.page}>
        {/* 방 정보 카드 */}
        <div className={styles.roomCard}>
          <h1 className={styles.roomName}>{room.title}</h1>
          <div className={styles.roomMeta}>
            <span className={styles.roomMetaItem}>
              <svg className={styles.roomMetaIcon} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="2.5" width="12" height="10" rx="1.5" />
                <path d="M1 6h12M4.5 1v3M9.5 1v3" />
              </svg>
              {room.dates.length}일
            </span>
            <span className={styles.roomMetaItem}>
              <svg className={styles.roomMetaIcon} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="5" r="2.5" />
                <path d="M2 13c0-2.76 2.24-5 5-5s5 2.24 5 5" />
              </svg>
              {room.participantsCount}명 참여 중
            </span>
          </div>

          <div className={styles.shareRow}>
            <span className={styles.shareLabel}>코드</span>
            <span className={styles.shareCode}>{room.joinCode}</span>
            <button className={`${styles.copyButton} ${copied ? styles.copyButtonCopied : ''}`} onClick={handleCopy}>
              {copied
                ? <><svg className={styles.copyIcon} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5" /></svg>복사됨</>
                : <><svg className={styles.copyIcon} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="7" height="7" rx="1" /><path d="M1 8V2a1 1 0 0 1 1-1h6" /></svg>복사</>
              }
            </button>
          </div>
        </div>

        {/* 참가자 목록 */}
        {room.participantInfoResponses.length > 0 && (
          <div className={styles.participants}>
            <span className={styles.sectionTitle}>
              참가자 <span className={styles.sectionBadge}>{room.participantsCount}명</span>
            </span>
            <div className={styles.participantList}>
              {room.participantInfoResponses.map(p => (
                <span key={p.participantId} className={styles.participantChip}>
                  <span className={styles.participantAvatar}>{p.username[0]}</span>
                  {p.username}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 히트맵 */}
        <div className={styles.heatmapSection}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className={styles.sectionTitle}>시간대별 현황</span>
            <div className={styles.legend}>
              <span className={styles.legendLabel}>적음</span>
              <div className={styles.legendScale}>
                {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} className={styles.legendDot} style={{ background: `var(--color-heatmap-${l})` }} />
                ))}
              </div>
              <span className={styles.legendLabel}>많음</span>
            </div>
          </div>

          <div className={styles.heatmapWrapper}>
            <div className={styles.heatmapGrid} style={{ '--col-count': room.dates.length } as React.CSSProperties}>
              <div className={styles.heatmapHeaderSpacer} />
              {room.dates.map(dk => {
                const [yStr, mStr, dStr] = dk.split('-')
                const date = new Date(Number(yStr), Number(mStr) - 1, Number(dStr))
                return (
                  <div key={dk} className={styles.heatmapDateHeader}>
                    <span className={styles.heatmapDateDay}>{WEEKDAY_SHORT[date.getDay()]}</span>
                    <span className={styles.heatmapDateNum}>{Number(dStr)}</span>
                  </div>
                )
              })}

              {Array.from({ length: SLOTS_PER_DAY }, (_, slotIdx) => (
                <>
                  <div key={`lbl-${slotIdx}`} className={`${styles.heatmapTimeLabel} ${isHourBoundary(slotIdx) ? styles.heatmapTimeLabelHour : ''}`}>
                    <span className={styles.heatmapTimeLabelText}>{slotLabel(slotIdx)}</span>
                  </div>
                  {room.dates.map(dk => {
                    const key = `${dk}__${slotIdx}`
                    const count = voteMap.get(key) ?? 0
                    const level = getLevelFromCount(count, maxVote)
                    const tooltip = count > 0 ? `${formatDateLabel(dk)} ${formatSlotTime(slotIdx)} · ${count}명` : ''
                    return (
                      <div
                        key={key}
                        className={`${styles.heatmapCell} ${isHourBoundary(slotIdx) ? styles.heatmapCellHourBoundary : ''}`}
                        data-level={level}
                        data-tooltip={tooltip}
                      />
                    )
                  })}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* TOP 5 순위 */}
        {topSlots.length > 0 && (
          <div className={styles.rankingSection}>
            <span className={styles.sectionTitle}>인기 시간 TOP {TOP_N}</span>
            <div className={styles.rankingList}>
              {topSlots.map((sv, idx) => {
                const rank = idx + 1
                const badgeClass = rank === 1 ? styles.rankBadge1 : rank === 2 ? styles.rankBadge2 : rank === 3 ? styles.rankBadge3 : styles.rankBadgeOther
                return (
                  <div key={`${sv.dateKey}-${sv.slot}`} className={`${styles.rankingItem} ${rank === 1 ? styles.rankingItemFirst : ''}`}>
                    <div className={`${styles.rankBadge} ${badgeClass}`}>{rank}</div>
                    <div className={styles.rankBody}>
                      <span className={styles.rankTime}>{formatSlotTime(sv.slot)}</span>
                      <span className={styles.rankDate}>{formatDateLabel(sv.dateKey)}</span>
                    </div>
                    <div className={styles.rankVotes}>
                      <span className={styles.rankVoteCount}>{sv.count}</span>
                      <span className={styles.rankVoteLabel}>명 가능</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className={styles.bottomBar}>
        <button className={styles.voteButton} onClick={handleVote}>
          <svg className={styles.voteButtonIcon} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="9" r="7.5" />
            <path d="M9 5v4l2.5 2.5" />
          </svg>
          내 가능 시간 투표하기
        </button>
      </div>
    </PageLayout>
  )
}
