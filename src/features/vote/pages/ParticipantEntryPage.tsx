import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageLayout from '@/shared/components/ui/PageLayout'
import styles from './ParticipantEntryPage.module.css'

const USERNAME_MAX = 20

export default function ParticipantEntryPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()

  /* 로그인 사용자의 경우 props 또는 context로 기본 닉네임을 주입할 예정 */
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = () => {
    if (!username.trim()) return
    // TODO: POST /api/participant 호출 후 투표 화면으로 이동
    navigate(`/vote/${roomId}/timeslot`, {
      state: { username: username.trim(), password: password || undefined },
    })
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
            투표 참가
          </div>
          <h1 className={styles.title}>이름을<br />알려주세요</h1>
          <p className={styles.subtitle}>투표 결과에 표시될 이름이에요. 다음에 수정하려면 같은 이름으로 들어오면 돼요.</p>
        </div>

        <div className={styles.form}>
          {/* 이름 입력 */}
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
              autoFocus
            />
            <span className={styles.fieldHint}>
              같은 이름으로 다시 들어오면 기존 투표를 수정할 수 있어요
            </span>
          </div>

          <div className={styles.divider} />

          {/* 비밀번호 (선택) */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="password">
              비밀번호
              <span className={styles.fieldOptional}>선택</span>
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
                {showPassword
                  ? <EyeOffIcon className={styles.toggleIcon} />
                  : <EyeIcon className={styles.toggleIcon} />}
              </button>
            </div>
            <span className={styles.fieldHint}>
              비밀번호를 설정하면 동일한 이름으로 들어와도 비밀번호가 틀리면 수정할 수 없어요
            </span>
          </div>
        </div>

        {/* 재방문 안내 */}
        <div className={styles.returningNote}>
          <svg className={styles.returningIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3M8 10.5v.5" />
          </svg>
          <p className={styles.returningText}>
            이미 투표한 적 있다면, 같은 이름(과 비밀번호)으로 들어오세요. 기존 투표를 불러와 수정할 수 있어요.
          </p>
        </div>

        {/* 다음 버튼 */}
        <div className={styles.submitArea}>
          <button className={styles.submitButton} onClick={handleSubmit} disabled={!username.trim()}>
            시간 선택하기
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

/* ── 아이콘 ── */
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
