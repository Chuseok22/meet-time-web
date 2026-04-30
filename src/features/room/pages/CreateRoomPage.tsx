import { useState, useCallback } from 'react'
import PageLayout from '@/shared/components/ui/PageLayout'
import styles from './CreateRoomPage.module.css'

const ROOM_NAME_MAX = 30

/* ── 날짜 유틸 ── */
const toDateKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS_KO = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

interface CalendarProps {
  selected: Set<string>
  onToggle: (key: string) => void
}

function Calendar({ selected, onToggle }: CalendarProps) {
  const today = new Date()
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const isPast = (key: string) => key < todayKey
  const isToday = (key: string) => key === todayKey

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  /* 이전 달로 돌아갈 수 없도록 — 현재 달보다 과거면 비활성 */
  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth()

  const cells: Array<{ key: string; day: number } | null> = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      key: toDateKey(viewYear, viewMonth, i + 1),
      day: i + 1,
    })),
  ]

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button className={styles.calendarNavBtn} onClick={prevMonth} disabled={!canGoPrev} aria-label="이전 달">
          <svg className={styles.calendarNavIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 4L6 8l4 4" />
          </svg>
        </button>
        <span className={styles.calendarMonth}>{viewYear}년 {MONTHS_KO[viewMonth]}</span>
        <button className={styles.calendarNavBtn} onClick={nextMonth} aria-label="다음 달">
          <svg className={styles.calendarNavIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>
      </div>

      <div className={styles.calendarWeekdays}>
        {WEEKDAYS.map((w, i) => (
          <span
            key={w}
            className={`${styles.calendarWeekday} ${i === 0 ? styles.calendarWeekdaySun : ''} ${i === 6 ? styles.calendarWeekdaySat : ''}`}
          >
            {w}
          </span>
        ))}
      </div>

      <div className={styles.calendarDays}>
        {cells.map((cell, idx) => {
          if (!cell) return <span key={`empty-${idx}`} className={`${styles.calendarDay} ${styles.calendarDayEmpty}`} />

          const past = isPast(cell.key)
          const isSelected = selected.has(cell.key)

          return (
            <button
              key={cell.key}
              className={[
                styles.calendarDay,
                past ? styles.calendarDayPast : '',
                isToday(cell.key) ? styles.calendarDayToday : '',
                isSelected ? styles.calendarDaySelected : '',
              ].join(' ')}
              onClick={() => !past && onToggle(cell.key)}
              disabled={past}
              aria-pressed={isSelected}
              aria-label={`${viewYear}년 ${viewMonth + 1}월 ${cell.day}일`}
            >
              {cell.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── 메인 페이지 ── */
export default function CreateRoomPage() {
  const [roomName, setRoomName] = useState('')
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())

  const toggleDate = useCallback((key: string) => {
    setSelectedDates(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const removeDate = (key: string) => {
    setSelectedDates(prev => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  const clearAll = () => setSelectedDates(new Set())

  const sortedDates = Array.from(selectedDates).sort()

  const formatDateTag = (key: string) => {
    const [, m, d] = key.split('-')
    return `${parseInt(m)}/${parseInt(d)}`
  }

  const canSubmit = roomName.trim().length > 0 && selectedDates.size > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    // TODO: POST /api/rooms 호출 후 방 메인 화면으로 이동
  }

  return (
    <PageLayout title="새 방 만들기">
      <div className={styles.page}>
        {/* 방 이름 */}
        <div className={styles.section}>
          <label className={styles.sectionLabel} htmlFor="room-name">미팅 이름</label>
          <input
            id="room-name"
            className={styles.input}
            type="text"
            placeholder="예: 팀 회의, 스터디 모임"
            value={roomName}
            maxLength={ROOM_NAME_MAX}
            onChange={e => setRoomName(e.target.value)}
            autoComplete="off"
          />
          <span className={styles.inputCount}>{roomName.length} / {ROOM_NAME_MAX}</span>
        </div>

        {/* 날짜 선택 */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>날짜 선택</span>
          <span className={styles.sectionSub}>여러 날짜를 자유롭게 선택할 수 있어요</span>
          <Calendar selected={selectedDates} onToggle={toggleDate} />
        </div>

        {/* 선택된 날짜 목록 */}
        <div className={styles.selectedDates}>
          <div className={styles.selectedDatesHeader}>
            <span className={styles.selectedCount}>
              선택된 날짜
              {selectedDates.size > 0 && (
                <span className={styles.selectedCountBadge}>{selectedDates.size}</span>
              )}
            </span>
            {selectedDates.size > 0 && (
              <button className={styles.clearAll} onClick={clearAll}>전체 해제</button>
            )}
          </div>
          <div className={styles.selectedDateTags}>
            {sortedDates.length === 0
              ? <span className={styles.emptyDateHint}>달력에서 날짜를 선택해 주세요</span>
              : sortedDates.map(key => (
                <span key={key} className={styles.dateTag}>
                  {formatDateTag(key)}
                  <button className={styles.dateTagRemove} onClick={() => removeDate(key)} aria-label={`${key} 제거`}>
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M3 3l8 8M11 3l-8 8" />
                    </svg>
                  </button>
                </span>
              ))
            }
          </div>
        </div>

        {/* 생성 버튼 */}
        <div className={styles.submitArea}>
          <button className={styles.submitButton} onClick={handleSubmit} disabled={!canSubmit}>
            방 만들기
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
