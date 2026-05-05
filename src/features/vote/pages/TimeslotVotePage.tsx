import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageLayout from '@/shared/components/ui/PageLayout'
import PageSeo from '@/shared/components/seo/PageSeo'
import { useSubmitTime } from '@/features/vote/hooks/useParticipant'
import { selectedSlotsToRequest, responseToSelectedSlots } from '@/shared/utils/timeSlot'
import { ApiException } from '@/shared/types/api.types'
import { getErrorKey, ERROR_FALLBACK_KEY } from '@/shared/constants/errorCodes'
import type { DateAvailability } from '@/features/room/types/room.types'
import styles from './TimeslotVotePage.module.css'

/* ── 타임슬롯 상수 ── */
const START_HOUR = 8
const SLOTS_PER_DAY = (24 - START_HOUR) * 2

const formatSlotLabel = (slotIndex: number): string => {
  const totalMinutes = START_HOUR * 60 + slotIndex * 30
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (m !== 0) return ''
  return `${h}:00`
}

const isHourBoundary = (slotIndex: number) => (slotIndex * 30) % 60 === 0

const parseDateKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/* formatDateHeader는 locale에 의존하므로 컴포넌트 내부에서 정의 */

const slotKey = (dateKey: string, slot: number) => `${dateKey}__${slot}`

/* router state 타입 */
interface VoteState {
  participantId: string
  username: string
  dates: string[]
  dateAvailability: DateAvailability[]
}

export default function TimeslotVotePage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as VoteState | null
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('ko') ? 'ko' : 'en'

  const formatDateHeader = (key: string) => {
    const date = parseDateKey(key)
    return {
      day: date.getDate(),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date),
      isToday: new Date().toDateString() === date.toDateString(),
    }
  }

  const submitTime = useSubmitTime(roomId!)

  const dates = useMemo(() => state?.dates ?? [], [state?.dates])
  const participantId = state?.participantId ?? ''

  /* 기존 투표 데이터 복원 */
  const initialSelected = useMemo(() => {
    if (!state?.dateAvailability || !participantId) return new Set<string>()
    return responseToSelectedSlots(state.dateAvailability, participantId)
  }, [state?.dateAvailability, participantId])

  const [selected, setSelected] = useState<Set<string>>(initialSelected)
  const [errorMsg, setErrorMsg] = useState('')

  /* router state 없이 직접 접근한 경우 entry 페이지로 리다이렉트 */
  useEffect(() => {
    if (!state?.participantId) {
      navigate(`/vote/${roomId}/entry`, { replace: true })
    }
  }, [state, roomId, navigate])

  /* ── 드래그 상태 ── */
  const dragRef = useRef<{
    active: boolean
    isAdding: boolean
    startDateIdx: number
    startSlot: number
    endDateIdx: number
    endSlot: number
  } | null>(null)

  const [dragPreview, setDragPreview] = useState<Set<string>>(new Set())

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

  const handlePointerDown = useCallback((dateIdx: number, slot: number) => {
    const key = slotKey(dates[dateIdx], slot)
    const isAdding = !selected.has(key)
    dragRef.current = { active: true, isAdding, startDateIdx: dateIdx, startSlot: slot, endDateIdx: dateIdx, endSlot: slot }
    setDragPreview(computeDragRange(dateIdx, slot, dateIdx, slot))
  }, [selected, dates, computeDragRange])

  const handlePointerEnter = useCallback((dateIdx: number, slot: number) => {
    if (!dragRef.current?.active) return
    dragRef.current.endDateIdx = dateIdx
    dragRef.current.endSlot = slot
    setDragPreview(computeDragRange(dragRef.current.startDateIdx, dragRef.current.startSlot, dateIdx, slot))
  }, [computeDragRange])

  const handlePointerUp = useCallback(() => {
    if (!dragRef.current?.active) return
    const { isAdding } = dragRef.current
    setSelected(prev => {
      const next = new Set(prev)
      dragPreview.forEach(k => { if (isAdding) next.add(k); else next.delete(k) })
      return next
    })
    dragRef.current = null
    setDragPreview(new Set())
  }, [dragPreview])

  useEffect(() => {
    const onUp = () => handlePointerUp()
    window.addEventListener('pointerup', onUp)
    return () => window.removeEventListener('pointerup', onUp)
  }, [handlePointerUp])

  const handleSubmit = async () => {
    if (selected.size === 0 || !participantId || submitTime.isPending) return
    setErrorMsg('')
    try {
      await submitTime.mutateAsync({
        participantId,
        availabilityTimeRequests: selectedSlotsToRequest(selected, dates),
      })
      navigate(`/room/${roomId}`, { replace: true })
    } catch (err) {
      if (err instanceof ApiException) {
        setErrorMsg(t(getErrorKey(err.errorCode)) || t(ERROR_FALLBACK_KEY))
      } else {
        setErrorMsg(t(ERROR_FALLBACK_KEY))
      }
    }
  }

  if (!state?.participantId) return null

  return (
    <PageLayout title={t('vote.timeslotPageTitle')}>
      <PageSeo title={t('vote.timeslotPageTitle')} noIndex />
      <div className={styles.page}>
        <div className={styles.guide}>
          <svg className={styles.guideIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v5l3 3" /><circle cx="8" cy="8" r="6.5" />
          </svg>
          <span className={styles.guideText}>{t('vote.timeslotGuide')}</span>
        </div>

        {selected.size > 0 && (
          <div className={styles.selectionBar}>
            <span className={styles.selectionBarDot} />
            <span className={styles.selectionBarText}>
              <span className={styles.selectionBarCount}>{t('vote.timeslotSelectionCount', { count: selected.size })}</span> {t('vote.timeslotSelectionLabel')}
            </span>
            <button className={styles.clearSelectedBtn} onClick={() => setSelected(new Set())}>{t('vote.timeslotClearAll')}</button>
          </div>
        )}

        {errorMsg && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-error)', padding: '0 var(--space-1)' }}>
            {errorMsg}
          </p>
        )}

        <div className={styles.gridWrapper}>
          <div className={styles.grid} style={{ '--col-count': dates.length } as React.CSSProperties}>
            {/* 날짜 헤더 */}
            <div className={styles.gridHeaderSpacer} />
            {dates.map(dateKey => {
              const info = formatDateHeader(dateKey)
              return (
                <div key={dateKey} className={styles.dateHeader}>
                  <span className={styles.dateHeaderDay}>{info.weekday}</span>
                  <span className={`${styles.dateHeaderNum} ${info.isToday ? styles.dateHeaderNumToday : ''}`}>{info.day}</span>
                </div>
              )
            })}

            {/* 슬롯 행 */}
            {Array.from({ length: SLOTS_PER_DAY }, (_, slotIdx) => (
              <>
                <div key={`label-${slotIdx}`} className={`${styles.timeLabel} ${isHourBoundary(slotIdx) ? styles.timeLabelHour : ''}`}>
                  <span className={styles.timeLabelText}>{formatSlotLabel(slotIdx)}</span>
                </div>
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

        <div className={styles.bottomBar}>
          <button className={styles.submitButton} onClick={handleSubmit} disabled={selected.size === 0 || submitTime.isPending}>
            {submitTime.isPending ? t('vote.timeslotSubmitting') : selected.size === 0 ? t('vote.timeslotNoSelection') : t('vote.timeslotSubmit', { count: selected.size })}
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
