import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageLayout from '@/shared/components/ui/PageLayout'
import { useCreateRoom } from '@/features/room/hooks/useRoom'
import { ApiException } from '@/shared/types/api.types'
import { getErrorKey } from '@/shared/constants/errorCodes'
import PageSeo from '@/shared/components/seo/PageSeo'
import styles from './CreateRoomPage.module.css'

const ROOM_NAME_MAX = 30

/* ── 날짜 유틸 ── */
const toDateKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

interface CalendarProps {
  selected: Set<string>
  onToggle: (key: string) => void
  locale: string
}

function Calendar({ selected, onToggle, locale }: CalendarProps) {
  const { t } = useTranslation()
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
        <button className={styles.calendarNavBtn} onClick={prevMonth} disabled={!canGoPrev} aria-label={t('createRoom.prevMonth')}>
          <svg className={styles.calendarNavIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 4L6 8l4 4" />
          </svg>
        </button>
        <span className={styles.calendarMonth}>
          {new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(new Date(viewYear, viewMonth))}
        </span>
        <button className={styles.calendarNavBtn} onClick={nextMonth} aria-label={t('createRoom.nextMonth')}>
          <svg className={styles.calendarNavIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>
      </div>

      <div className={styles.calendarWeekdays}>
        {Array.from({ length: 7 }, (_, i) =>
          new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, 7 + i))
        ).map((w, i) => (
          <span
            key={i}
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
              aria-label={new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(viewYear, viewMonth, cell.day))}
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
  const navigate = useNavigate()
  const createRoom = useCreateRoom()
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('ko') ? 'ko' : 'en'
  const [roomName, setRoomName] = useState('')
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [errorMsg, setErrorMsg] = useState('')

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
    const [y, m, d] = key.split('-').map(Number)
    return new Intl.DateTimeFormat(locale, { month: 'numeric', day: 'numeric' }).format(new Date(y, m - 1, d))
  }

  const canSubmit = roomName.trim().length > 0 && selectedDates.size > 0

  const handleSubmit = async () => {
    if (!canSubmit || createRoom.isPending) return
    setErrorMsg('')
    try {
      const room = await createRoom.mutateAsync({
        title: roomName.trim(),
        dates: Array.from(selectedDates).sort(),
      })
      navigate(`/room/${room.meetingRoomId}`, { replace: true })
    } catch (err) {
      if (err instanceof ApiException) {
        setErrorMsg(t(getErrorKey(err.errorCode)) || t('createRoom.submitError'))
      } else {
        setErrorMsg(t('createRoom.submitError'))
      }
    }
  }

  return (
    <PageLayout title={t('createRoom.pageTitle')}>
      <PageSeo title={t('createRoom.pageTitle')} />
      <div className={styles.page}>
        {/* 방 이름 */}
        <div className={styles.section}>
          <label className={styles.sectionLabel} htmlFor="room-name">{t('createRoom.roomNameLabel')}</label>
          <input
            id="room-name"
            className={styles.input}
            type="text"
            placeholder={t('createRoom.roomNamePlaceholder')}
            value={roomName}
            maxLength={ROOM_NAME_MAX}
            onChange={e => setRoomName(e.target.value)}
            autoComplete="off"
          />
          <span className={styles.inputCount}>{roomName.length} / {ROOM_NAME_MAX}</span>
        </div>

        {/* 날짜 선택 */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>{t('createRoom.dateSectionLabel')}</span>
          <span className={styles.sectionSub}>{t('createRoom.dateSectionSub')}</span>
          <Calendar selected={selectedDates} onToggle={toggleDate} locale={locale} />
        </div>

        {/* 선택된 날짜 목록 */}
        <div className={styles.selectedDates}>
          <div className={styles.selectedDatesHeader}>
            <span className={styles.selectedCount}>
              {t('createRoom.selectedDates')}
              {selectedDates.size > 0 && (
                <span className={styles.selectedCountBadge}>{selectedDates.size}</span>
              )}
            </span>
            {selectedDates.size > 0 && (
              <button className={styles.clearAll} onClick={clearAll}>{t('createRoom.clearAll')}</button>
            )}
          </div>
          <div className={styles.selectedDateTags}>
            {sortedDates.length === 0
              ? <span className={styles.emptyDateHint}>{t('createRoom.emptyDateHint')}</span>
              : sortedDates.map(key => (
                <span key={key} className={styles.dateTag}>
                  {formatDateTag(key)}
                  <button className={styles.dateTagRemove} onClick={() => removeDate(key)} aria-label={t('createRoom.removeDate', { date: formatDateTag(key) })}>
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M3 3l8 8M11 3l-8 8" />
                    </svg>
                  </button>
                </span>
              ))
            }
          </div>
        </div>

        {errorMsg && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-error)' }}>{errorMsg}</p>
        )}

        {/* 생성 버튼 */}
        <div className={styles.submitArea}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!canSubmit || createRoom.isPending}
          >
            {createRoom.isPending ? t('createRoom.submitting') : t('createRoom.submit')}
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
