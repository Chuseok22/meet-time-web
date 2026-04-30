import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageLayout from '@/shared/components/ui/PageLayout'
import styles from './RoomMainPage.module.css'

/* ── 타입 ── */
interface Participant {
  id: string
  username: string
}

interface SlotVote {
  dateKey: string
  slot: number  /* 0-base: 0=08:00, 1=08:30 … */
  count: number
}

interface RoomData {
  id: string
  name: string
  joinCode: string
  dates: string[]
  participants: Participant[]
  slotVotes: SlotVote[]
}

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
  const [, m, d] = key.split('-').map(Number)
  const date = new Date(Number(key.split('-')[0]), m - 1, d)
  return `${m}/${d} (${WEEKDAY_SHORT[date.getDay()]})`
}

const isHourBoundary = (slot: number) => (slot * 30) % 60 === 0

const slotLabel = (slot: number) => {
  const totalMin = START_HOUR * 60 + slot * 30
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (m !== 0) return ''
  return h === 24 ? '자정' : `${h}:00`
}

const getLevelFromCount = (count: number, max: number): number => {
  if (count === 0 || max === 0) return 0
  const ratio = count / max
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

/* ── 목업 데이터 ── */
const MOCK_ROOM: RoomData = {
  id: 'room-1',
  name: '5월 팀 회의',
  joinCode: 'A1B2C3D4',
  dates: ['2026-05-01', '2026-05-02', '2026-05-08'],
  participants: [
    { id: 'p1', username: '추석이' },
    { id: 'p2', username: '지훈' },
    { id: 'p3', username: '민지' },
    { id: 'p4', username: '정현' },
  ],
  slotVotes: [
    { dateKey: '2026-05-01', slot: 4, count: 4 },   // 10:00
    { dateKey: '2026-05-01', slot: 5, count: 4 },   // 10:30
    { dateKey: '2026-05-01', slot: 6, count: 3 },   // 11:00
    { dateKey: '2026-05-01', slot: 7, count: 3 },   // 11:30
    { dateKey: '2026-05-02', slot: 2, count: 2 },   // 09:00
    { dateKey: '2026-05-02', slot: 3, count: 2 },   // 09:30
    { dateKey: '2026-05-02', slot: 8, count: 1 },   // 12:00
    { dateKey: '2026-05-08', slot: 10, count: 3 },  // 13:00
    { dateKey: '2026-05-08', slot: 11, count: 4 },  // 13:30
    { dateKey: '2026-05-08', slot: 12, count: 4 },  // 14:00
  ],
}

/* ── 메인 컴포넌트 ── */
export default function RoomMainPage() {
  useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  /* 실제 구현 시 useQuery로 교체 */
  const room = MOCK_ROOM

  const voteMap = new Map<string, number>()
  room.slotVotes.forEach(v => {
    voteMap.set(`${v.dateKey}__${v.slot}`, v.count)
  })

  const maxVote = Math.max(0, ...room.slotVotes.map(v => v.count))

  /* 상위 5개 시간 계산 */
  const topSlots = [...room.slotVotes]
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_N)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(room.joinCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* 클립보드 API 미지원 환경 폴백 */
    }
  }

  const handleVote = () => {
    navigate(`/vote/${room.id}/entry`)
  }

  return (
    <PageLayout showBack onBack={() => navigate('/select')}>
      <div className={styles.page}>
        {/* 방 정보 카드 */}
        <div className={styles.roomCard}>
          <h1 className={styles.roomName}>{room.name}</h1>
          <div className={styles.roomMeta}>
            <span className={styles.roomMetaItem}>
              <svg className={styles.roomMetaIcon} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="2.5" width="12" height="10" rx="1.5" />
                <path d="M1 6h12" />
                <path d="M4.5 1v3M9.5 1v3" />
              </svg>
              {room.dates.length}일
            </span>
            <span className={styles.roomMetaItem}>
              <svg className={styles.roomMetaIcon} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="5" r="2.5" />
                <path d="M2 13c0-2.76 2.24-5 5-5s5 2.24 5 5" />
              </svg>
              {room.participants.length}명 참여 중
            </span>
          </div>

          {/* 참여 코드 공유 */}
          <div className={styles.shareRow}>
            <span className={styles.shareLabel}>코드</span>
            <span className={styles.shareCode}>{room.joinCode}</span>
            <button
              className={`${styles.copyButton} ${copied ? styles.copyButtonCopied : ''}`}
              onClick={handleCopy}
            >
              {copied
                ? <>
                    <svg className={styles.copyIcon} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                    복사됨
                  </>
                : <>
                    <svg className={styles.copyIcon} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="4" width="7" height="7" rx="1" />
                      <path d="M1 8V2a1 1 0 0 1 1-1h6" />
                    </svg>
                    복사
                  </>
              }
            </button>
          </div>
        </div>

        {/* 참가자 목록 */}
        <div className={styles.participants}>
          <span className={styles.sectionTitle}>
            참가자
            <span className={styles.sectionBadge}>{room.participants.length}명</span>
          </span>
          <div className={styles.participantList}>
            {room.participants.map(p => (
              <span key={p.id} className={styles.participantChip}>
                <span className={styles.participantAvatar}>{p.username[0]}</span>
                {p.username}
              </span>
            ))}
          </div>
        </div>

        {/* 히트맵 */}
        <div className={styles.heatmapSection}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className={styles.sectionTitle}>시간대별 현황</span>
            <div className={styles.legend}>
              <span className={styles.legendLabel}>적음</span>
              <div className={styles.legendScale}>
                {[0, 1, 2, 3, 4].map(l => (
                  <div
                    key={l}
                    className={styles.legendDot}
                    style={{ background: `var(--color-heatmap-${l})` }}
                  />
                ))}
              </div>
              <span className={styles.legendLabel}>많음</span>
            </div>
          </div>

          <div className={styles.heatmapWrapper}>
            <div
              className={styles.heatmapGrid}
              style={{ '--col-count': room.dates.length } as React.CSSProperties}
            >
              {/* 날짜 헤더 */}
              <div className={styles.heatmapHeaderSpacer} />
              {room.dates.map(dk => {
                const [, m, d] = dk.split('-').map(Number)
                const date = new Date(Number(dk.split('-')[0]), m - 1, d)
                return (
                  <div key={dk} className={styles.heatmapDateHeader}>
                    <span className={styles.heatmapDateDay}>{WEEKDAY_SHORT[date.getDay()]}</span>
                    <span className={styles.heatmapDateNum}>{d}</span>
                  </div>
                )
              })}

              {/* 슬롯 행 */}
              {Array.from({ length: SLOTS_PER_DAY }, (_, slotIdx) => (
                <>
                  <div
                    key={`lbl-${slotIdx}`}
                    className={`${styles.heatmapTimeLabel} ${isHourBoundary(slotIdx) ? styles.heatmapTimeLabelHour : ''}`}
                  >
                    <span className={styles.heatmapTimeLabelText}>{slotLabel(slotIdx)}</span>
                  </div>

                  {room.dates.map(dk => {
                    const key = `${dk}__${slotIdx}`
                    const count = voteMap.get(key) ?? 0
                    const level = getLevelFromCount(count, maxVote)
                    const time = formatSlotTime(slotIdx)
                    const tooltip = count > 0 ? `${formatDateLabel(dk)} ${time} · ${count}명` : ''

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

        {/* 상위 5개 시간 순위 */}
        <div className={styles.rankingSection}>
          <span className={styles.sectionTitle}>
            인기 시간 TOP {TOP_N}
          </span>
          <div className={styles.rankingList}>
            {topSlots.map((sv, idx) => {
              const rank = idx + 1
              const badgeClass = rank === 1 ? styles.rankBadge1
                : rank === 2 ? styles.rankBadge2
                : rank === 3 ? styles.rankBadge3
                : styles.rankBadgeOther

              return (
                <div
                  key={`${sv.dateKey}-${sv.slot}`}
                  className={`${styles.rankingItem} ${rank === 1 ? styles.rankingItemFirst : ''}`}
                >
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
      </div>

      {/* 하단 투표 버튼 */}
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
