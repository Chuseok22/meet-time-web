import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/shared/components/ui/PageLayout'
import styles from './JoinRoomPage.module.css'

const CODE_MAX = 8

export default function JoinRoomPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (raw.length <= CODE_MAX) {
      setCode(raw)
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (code.length < 4) {
      setError('참여 코드를 올바르게 입력해 주세요')
      return
    }
    // TODO: GET /api/rooms/join-code/{code} 호출 후 방 메인 화면으로 이동
    navigate(`/room/join/${code}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <PageLayout title="방 참가하기">
      <div className={styles.page}>
        <div className={styles.heading}>
          <h1 className={styles.title}>참여 코드를<br />입력해 주세요</h1>
          <p className={styles.subtitle}>방장에게 받은 참여 코드를 입력하면 바로 들어갈 수 있어요</p>
        </div>

        {/* 코드 입력 */}
        <div className={styles.codeSection}>
          <label className={styles.codeLabel} htmlFor="join-code">참여 코드</label>
          <div className={styles.codeInputWrapper}>
            <input
              id="join-code"
              className={`${styles.codeInput} ${error ? styles.codeInputError : ''}`}
              type="text"
              inputMode="text"
              placeholder="A1B2C3D4"
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              autoFocus
            />
            {code.length > 0 && (
              <button className={styles.clearButton} onClick={() => { setCode(''); setError('') }} aria-label="지우기">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 3l8 8M11 3l-8 8" />
                </svg>
              </button>
            )}
          </div>
          {error && (
            <p className={styles.errorMsg}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="7" cy="7" r="6" />
                <path d="M7 4v3M7 9.5v.5" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* 안내 */}
        <div className={styles.hint}>
          <div className={styles.hintIcon}>
            <svg className={styles.hintIconSvg} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="9" r="7.5" />
              <path d="M9 6v3M9 11.5v.5" />
            </svg>
          </div>
          <div className={styles.hintBody}>
            <span className={styles.hintTitle}>참여 코드는 어디서 받나요?</span>
            <span className={styles.hintDesc}>
              방을 만든 사람에게 공유 코드나 링크를 받아보세요. 방 메인 화면에서 코드를 확인할 수 있어요.
            </span>
          </div>
        </div>

        {/* 참가 버튼 */}
        <div className={styles.submitArea}>
          <button className={styles.submitButton} onClick={handleSubmit} disabled={code.length < 4}>
            방 참가하기
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
