import { useNavigate } from 'react-router-dom'
import styles from './HomePage.module.css'

const KAKAO_LOGIN_URL = 'https://api.meet.chuseok22.com/oauth2/authorization/kakao'
const GOOGLE_LOGIN_URL = 'https://api.meet.chuseok22.com/oauth2/authorization/google'

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="14" height="11" rx="2" />
        <path d="M1 7h14" />
        <path d="M5 1v4M11 1v4" />
      </svg>
    ),
    main: '내 방 목록 한눈에 보기',
    sub: '만든 방과 참여한 방을 모아서 관리',
  },
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 6l-5 5-3-3" />
        <circle cx="8" cy="8" r="7" />
      </svg>
    ),
    main: '방 삭제 및 관리 권한',
    sub: '내가 만든 방은 직접 삭제할 수 있어요',
  },
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="6" r="3" />
        <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" />
      </svg>
    ),
    main: '내 참가 기록 관리',
    sub: '참여 취소 및 투표 수정을 쉽게',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_LOGIN_URL
  }

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL
  }

  const handleGuestStart = () => {
    navigate('/select')
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* 로고 */}
        <div className={styles.logoSection}>
          <div className={styles.logoMark}>
            <svg className={styles.logoMarkIcon} viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="13" stroke="white" strokeWidth="2.5" />
              <path d="M16 9v7l4.5 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <h1 className={styles.logoText}>
              meet<span className={styles.logoDot}>·</span>time
            </h1>
          </div>

          <div className={styles.tagline}>
            <span className={styles.taglineKo}>모두가 되는 시간을 찾아드려요</span>
            <span className={styles.taglineEn}>Find the time that works for everyone</span>
          </div>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className={styles.authSection}>
          <button className={`${styles.authButton} ${styles.kakaoButton}`} onClick={handleKakaoLogin}>
            <KakaoIcon className={styles.buttonIcon} />
            <span className={styles.buttonText}>카카오로 계속하기</span>
          </button>

          <button className={`${styles.authButton} ${styles.googleButton}`} onClick={handleGoogleLogin}>
            <GoogleIcon className={styles.buttonIcon} />
            <span className={styles.buttonText}>구글로 계속하기</span>
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>또는</span>
            <span className={styles.dividerLine} />
          </div>

          <button className={`${styles.authButton} ${styles.guestButton}`} onClick={handleGuestStart}>
            <span className={styles.buttonText}>게스트로 시작하기</span>
          </button>
        </div>

        {/* 로그인 혜택 */}
        <div className={styles.benefitsSection}>
          <p className={styles.benefitsTitle}>로그인하면 이런 점이 좋아요</p>
          <ul className={styles.benefitsList}>
            {benefits.map((benefit) => (
              <li key={benefit.main} className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <span className={styles.benefitIconSvg}>{benefit.icon}</span>
                </div>
                <div className={styles.benefitText}>
                  <span className={styles.benefitMain}>{benefit.main}</span>
                  <span className={styles.benefitSub}>{benefit.sub}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className={styles.footer}>
        로그인 없이도 방을 만들고 참여할 수 있어요
      </p>
    </div>
  )
}

/* ── SVG 아이콘 컴포넌트 ── */

interface IconProps {
  className?: string
}

function KakaoIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.755 1.737 5.181 4.368 6.618L5.3 21.1a.5.5 0 0 0 .726.543l5.26-3.063A12.04 12.04 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3Z" />
    </svg>
  )
}

function GoogleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
    </svg>
  )
}
