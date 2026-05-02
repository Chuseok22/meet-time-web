import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageLayout from '@/shared/components/ui/PageLayout'
import { useJoinParticipant } from '@/features/vote/hooks/useParticipant'
import { useMe } from '@/features/auth/hooks/useUser'
import { useRoom } from '@/features/room/hooks/useRoom'
import { ApiException } from '@/shared/types/api.types'
import { ERROR_CODES, ERROR_MESSAGES } from '@/shared/constants/errorCodes'
import styles from './ParticipantEntryPage.module.css'

const USERNAME_MAX = 20

export default function ParticipantEntryPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()

  const { data: me } = useMe()
  const { data: room } = useRoom(roomId!)
  const joinParticipant = useJoinParticipant()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  /* me가 처음 로드될 때 한 번만 닉네임 기본값 설정 */
  const nicknameInitialized = useRef(false)
  useEffect(() => {
    if (me && !nicknameInitialized.current) {
      setUsername(me.nickname)
      nicknameInitialized.current = true
    }
  }, [me])

  const handleSubmit = async () => {
    if (!username.trim() || !roomId || joinParticipant.isPending) return
    setErrorMsg('')

    try {
      const participant = await joinParticipant.mutateAsync({
        meetingRoomId: roomId,
        username: username.trim(),
        /* 로그인 사용자는 password 전송하지 않음 */
        ...(me ? {} : { password: password || undefined }),
      })

      navigate(`/vote/${roomId}/timeslot`, {
        state: {
          participantId: participant.participantId,
          username: participant.username,
          dates: room?.dates ?? [],
          dateAvailability: room?.dateAvailabilityResponses ?? [],
        },
      })
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.errorCode === ERROR_CODES.INVALID_PASSWORD) {
          setErrorMsg('비밀번호가 일치하지 않아요.')
        } else if (err.errorCode === ERROR_CODES.DUPLICATE_USERNAME) {
          setErrorMsg('이미 다른 사람이 사용 중인 이름이에요.')
        } else {
          setErrorMsg(ERROR_MESSAGES[err.errorCode] ?? err.errorMessage)
        }
      } else {
        setErrorMsg('참가에 실패했어요. 다시 시도해 주세요.')
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <PageLayout title="참가자 정보">
      <div className={styles.page}>
        <div className={styles.heading}>
          <div className={styles.roomTag}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="5" cy="5" r="5" />
            </svg>
            {room?.title ?? '투표 참가'}
          </div>
          <h1 className={styles.title}>이름을 알려주세요</h1>
          <p className={styles.subtitle}>
            {me
              ? '소셜 계정 이름이 자동으로 입력됐어요. 원하시면 변경할 수 있어요.'
              : '투표 결과에 표시될 이름이에요. 다음에 수정하려면 같은 이름으로 들어오면 돼요.'}
          </p>
        </div>

        <div className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="username">이름 (닉네임)</label>
            <input
              id="username"
              className={styles.fieldInput}
              type="text"
              placeholder="예: 추석이"
              value={username}
              maxLength={USERNAME_MAX}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoFocus={!me}
            />
            <span className={styles.fieldHint}>
              같은 이름으로 다시 들어오면 기존 투표를 수정할 수 있어요
            </span>
          </div>

          {/* 비밀번호는 Guest 전용 */}
          {!me && (
            <>
              <div className={styles.divider} />
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="password">
                  비밀번호 <span className={styles.fieldOptional}>선택</span>
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    className={styles.fieldInput}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="설정하면 본인만 수정 가능"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="new-password"
                  />
                  <button
                    className={styles.togglePassword}
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPassword ? <EyeOffIcon className={styles.toggleIcon} /> : <EyeIcon className={styles.toggleIcon} />}
                  </button>
                </div>
                <span className={styles.fieldHint}>
                  비밀번호를 설정하면 같은 이름이어도 비밀번호가 틀리면 수정할 수 없어요
                </span>
              </div>
            </>
          )}

          {errorMsg && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-error)', marginTop: 'calc(-1 * var(--space-2))' }}>
              {errorMsg}
            </p>
          )}
        </div>

        <div className={styles.returningNote}>
          <svg className={styles.returningIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3M8 10.5v.5" />
          </svg>
          <p className={styles.returningText}>
            이미 투표한 적 있다면, 같은 이름(과 비밀번호)으로 들어오세요. 기존 투표를 불러와 수정할 수 있어요.
          </p>
        </div>

        <div className={styles.submitArea}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!username.trim() || joinParticipant.isPending}
          >
            {joinParticipant.isPending ? '확인 중…' : '시간 선택하기'}
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

interface IconProps { className?: string }

function EyeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 9s3-5.5 8-5.5S17 9 17 9s-3 5.5-8 5.5S1 9 1 9Z" />
      <circle cx="9" cy="9" r="2.5" />
    </svg>
  )
}

function EyeOffIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2l14 14M7.5 7.6A2.5 2.5 0 0 0 11.4 11.5M5.3 5.4C3.3 6.6 2 9 2 9s2.5 5.5 7 5.5a7.2 7.2 0 0 0 3.7-1M9 3.5c4.5 0 7 5.5 7 5.5a13 13 0 0 1-1.5 2.3" />
    </svg>
  )
}
