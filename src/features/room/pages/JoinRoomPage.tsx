import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageLayout from '@/shared/components/ui/PageLayout'
import { useRoomByJoinCode } from '@/features/room/hooks/useRoom'
import { ApiException } from '@/shared/types/api.types'
import { ERROR_CODES, getErrorKey } from '@/shared/constants/errorCodes'
import PageSeo from '@/shared/components/seo/PageSeo'
import styles from './JoinRoomPage.module.css'

/* joinCode 형식: AB1-CD2 (대소문자 구분, 서버 Base58 패턴) */
const JOIN_CODE_MAX = 10

export default function JoinRoomPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [manualError, setManualError] = useState('')

  /* 코드가 입력되고 submit이 눌렸을 때만 조회 */
  const { data: room, isLoading, error } = useRoomByJoinCode(code, submitted)

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* 영문자·숫자·하이픈만 허용, 나머지 제거 */
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    if (raw.length <= JOIN_CODE_MAX) {
      setCode(raw)
      setSubmitted(false)
      setManualError('')
    }
  }

  const handleSubmit = () => {
    if (code.trim().length < 5) {
      setManualError(t('joinRoom.invalidCode'))
      return
    }
    setManualError('')
    setSubmitted(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  /* 조회 성공 시 방 메인으로 이동 */
  if (room) {
    navigate(`/room/${room.meetingRoomId}`, { replace: true })
  }

  const errorMessage = (() => {
    if (manualError) return manualError
    if (!error) return ''
    if (error instanceof ApiException) {
      if (error.errorCode === ERROR_CODES.MEETING_ROOM_NOT_FOUND) {
        return t('joinRoom.roomNotFound')
      }
      return t(getErrorKey(error.errorCode))
    }
    return t('joinRoom.roomFindError')
  })()

  return (
    <PageLayout title={t('joinRoom.pageTitle')}>
      <PageSeo title={t('joinRoom.pageTitle')} />
      <div className={styles.page}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{t('joinRoom.heading')}</h1>
          <p className={styles.subtitle}>{t('joinRoom.subtitle')}</p>
        </div>

        <div className={styles.codeSection}>
          <label className={styles.codeLabel} htmlFor="join-code">{t('joinRoom.codeLabel')}</label>
          <div className={styles.codeInputWrapper}>
            <input
              id="join-code"
              className={`${styles.codeInput} ${errorMessage ? styles.codeInputError : ''}`}
              type="text"
              inputMode="text"
              placeholder="AB1-CD2"
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
            />
            {code.length > 0 && (
              <button
                className={styles.clearButton}
                onClick={() => { setCode(''); setSubmitted(false); setManualError('') }}
                aria-label={t('common.clear')}
              >
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 3l8 8M11 3l-8 8" />
                </svg>
              </button>
            )}
          </div>
          {errorMessage && (
            <p className={styles.errorMsg}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="7" cy="7" r="6" />
                <path d="M7 4v3M7 9.5v.5" />
              </svg>
              {errorMessage}
            </p>
          )}
        </div>

        <div className={styles.hint}>
          <div className={styles.hintIcon}>
            <svg className={styles.hintIconSvg} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="9" r="7.5" />
              <path d="M9 6v3M9 11.5v.5" />
            </svg>
          </div>
          <div className={styles.hintBody}>
            <span className={styles.hintTitle}>{t('joinRoom.hintTitle')}</span>
            <span className={styles.hintDesc}>
              {t('joinRoom.hintDesc')}
            </span>
          </div>
        </div>

        <div className={styles.submitArea}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={code.length < 5 || isLoading}
          >
            {isLoading ? t('joinRoom.submitting') : t('joinRoom.submit')}
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
