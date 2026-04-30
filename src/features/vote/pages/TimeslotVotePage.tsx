import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageLayout from '@/shared/components/ui/PageLayout'
import styles from './TimeslotVotePage.module.css'

/* ── 타임슬롯 상수 ── */
/* 08:00 ~ 24:00, 30분 단위 → 32슬롯 */
const START_HOUR = 8
const END_HOUR = 24
const SLOTS_PER_DAY = (END_HOUR - START_HOUR) * 2

const WEEKDAY_SHORT = ['일', '월', '화', '수', '목', '금', '토']

const formatSlotLabel = (slotIndex: number): string => {
  const totalMinutes = START_HOUR * 60 + slotIndex * 30
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  /* 정각만 표시, 30분은 공백 */
  if (m !== 0) return ''
  if (h === 24) return '자정'
  return `${h}:00`
}

const isHourBoundary = (slotIndex: number) => (slotIndex * 30) % 60 === 0

/* ── 날짜 포맷 ── */
const parseDateKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const formatDateHeader = (key: string) => {
  const date = parseDateKey(key)
  return {
    month: `${date.getMonth() + 1}월`,
    day: date.getDate(),
    weekday: WEEKDAY_SHORT[date.getDay()],
    isToday: new Date().toDateString() === date.toDateString(),
  }
}

/* ── 슬롯 키 ── */
const slotKey = (dateKey: string, slot: number) => `${dateKey}__${slot}`

/* ── 메인 컴포넌트 ── */
interface TimeslotVotePageProps {
  /* 실제 구현 시 API로 받을 데이터; 현재는 목업 */
  dates?: string[]
}

export default function TimeslotVotePage({ dates: propDates }: TimeslotVotePageProps) {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()

  /* 목업 날짜 (실제론 방 조회 API 결과) — useMemo로 참조 안정화 */
  const dates = useMemo(
    () => propDates ?? ['2026-05-01', '2026-05-02', '2026-05-08', '2026-05-09'],
    [propDates],
  )

  /* 선택된 슬롯 집합 */
  const [selected, setSelected] = useState<Set<string>>(new Set())

  /* 드래그 상태 */
  const dragRef = useRef<{
    active: boolean
    startKey: string
    isAdding: boolean        /* true: 선택 추가, false: 선택 해제 */
    startDateIdx: number
    startSlot: number
    endDateIdx: number
    endSlot: number
  } | null>(null)

  const [dragPreview, setDragPreview] = useState<Set<string>>(new Set())

  /* 드래그로 덮인 슬롯 계산 */
  const computeDragRange = useCallback((
    dateIdxA: number, slotA: number,
    dateIdxB: number, slotB: number,
  ): Set<string> => {
    const result = new Set<string>()
    const minDate = Math.min(dateIdxA, dateIdxB)
    const maxDate = Math.max(dateIdxA, dateIdxB)
    const minSlot = Math.min(slotA, slotB)
    const maxSlot = Math.max(slotA, slotB)
    for (let di = minDate; di <= maxDate; di++) {
      for (let s = minSlot; s <= maxSlot; s++) {
        result.add(slotKey(dates[di], s))
      }
    }
    return result
  }, [dates])

  /* 포인터 이벤트 — 모바일 터치 + 마우스 통합 */
  const handlePointerDown = useCallback((dateIdx: number, slot: number) => {
    const key = slotKey(dates[dateIdx], slot)
    const isAdding = !selected.has(key)
    dragRef.current = {
      active: true,
      startKey: key,
      isAdding,
      startDateIdx: dateIdx,
      startSlot: slot,
      endDateIdx: dateIdx,
      endSlot: slot,
    }
    const preview = computeDragRange(dateIdx, slot, dateIdx, slot)
    setDragPreview(preview)
  }, [selected, dates, computeDragRange])

  const handlePointerEnter = useCallback((dateIdx: number, slot: number) => {
    if (!dragRef.current?.active) return
    dragRef.current.endDateIdx = dateIdx
    dragRef.current.endSlot = slot
    const preview = computeDragRange(
      dragRef.current.startDateIdx, dragRef.current.startSlot,
      dateIdx, slot,
    )
    setDragPreview(preview)
  }, [computeDragRange])

  const handlePointerUp = useCallback(() => {
    if (!dragRef.current?.active) return
    const { isAdding } = dragRef.current
    setSelected(prev => {
      const next = new Set(prev)
      dragPreview.forEach(k => {
        if (isAdding) next.add(k)
        else next.delete(k)
      })
      return next
    })
    dragRef.current = null
    setDragPreview(new Set())
  }, [dragPreview])

  /* 포인터를 그리드 밖에서 놓았을 때도 처리 */
  useEffect(() => {
    const onUp = () => handlePointerUp()
    window.addEventListener('pointerup', onUp)
    return () => window.removeEventListener('pointerup', onUp)
  }, [handlePointerUp])

  const clearAll = () => setSelected(new Set())

  const handleSubmit = () => {
    if (selected.size === 0) return
    // TODO: POST /api/time 호출 후 방 메인 화면으로 이동
    navigate(`/room/${roomId}`)
  }

  return (
    <PageLayout title="시간 선택">
      <div className={styles.page}>
        {/* 안내 */}
        <div className={styles.guide}>
          <svg className={styles.guideIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v5l3 3" />
            <circle cx="8" cy="8" r="6.5" />
          </svg>
          <span className={styles.guideText}>가능한 시간을 드래그해서 선택해 주세요 · 08:00 – 24:00</span>
        </div>

        {/* 선택 현황 */}
        {selected.size > 0 && (
          <div className={styles.selectionBar}>
            <span className={styles.selectionBarDot} />
            <span className={styles.selectionBarText}>
              <span className={styles.selectionBarCount}>{selected.size}개</span> 시간 선택됨
            </span>
            <button className={styles.clearSelectedBtn} onClick={clearAll}>전체 해제</button>
          </div>
        )}

        {/* 타임슬롯 그리드 */}
        <div className={styles.gridWrapper}>
          <div
            className={styles.grid}
            style={{ '--col-count': dates.length } as React.CSSProperties}
            onPointerLeave={() => {
              /* 그리드 밖으로 나가도 드래그 계속 유지 — pointerup으로만 종료 */
            }}
          >
            {/* 날짜 헤더 */}
            <div className={styles.gridHeaderSpacer} />
            {dates.map(dateKey => {
              const info = formatDateHeader(dateKey)
              return (
                <div key={dateKey} className={styles.dateHeader}>
                  <span className={styles.dateHeaderDay}>{info.weekday}</span>
                  <span className={`${styles.dateHeaderNum} ${info.isToday ? styles.dateHeaderNumToday : ''}`}>
                    {info.day}
                  </span>
                </div>
              )
            })}

            {/* 슬롯 행 */}
            {Array.from({ length: SLOTS_PER_DAY }, (_, slotIdx) => (
              <>
                {/* 시간 레이블 */}
                <div
                  key={`label-${slotIdx}`}
                  className={`${styles.timeLabel} ${isHourBoundary(slotIdx) ? styles.timeLabelHour : ''}`}
                >
                  <span className={styles.timeLabelText}>{formatSlotLabel(slotIdx)}</span>
                </div>

                {/* 날짜별 슬롯 */}
                {dates.map((dateKey, dateIdx) => {
                  const key = slotKey(dateKey, slotIdx)
                  const isSelected = selected.has(key)
                  const isPreview = dragPreview.has(key)
                  const isAdding = dragRef.current?.isAdding ?? true

                  return (
                    <div
                      key={key}
                      className={[
                        styles.slot,
                        isHourBoundary(slotIdx) ? styles.slotHourBoundary : '',
                        isSelected ? styles.slotSelected : '',
                        isPreview && !isSelected && isAdding ? styles.slotDragPreview : '',
                        isPreview && isSelected && !isAdding ? styles.slotDragPreview : '',
                      ].join(' ')}
                      onPointerDown={e => { e.preventDefault(); handlePointerDown(dateIdx, slotIdx) }}
                      onPointerEnter={() => handlePointerEnter(dateIdx, slotIdx)}
                    />
                  )
                })}
              </>
            ))}
          </div>
        </div>

        {/* 하단 고정 제출 버튼 */}
        <div className={styles.bottomBar}>
          <button className={styles.submitButton} onClick={handleSubmit} disabled={selected.size === 0}>
            {selected.size === 0 ? '시간을 선택해 주세요' : `${selected.size}개 시간으로 투표하기`}
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
