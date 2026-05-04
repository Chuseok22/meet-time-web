import { useNavigate } from 'react-router-dom'
import PageLayout from '@/shared/components/ui/PageLayout'
import { useMe } from '@/features/auth/hooks/useUser'
import { tokenStorage } from '@/shared/api/apiClient'
import PageSeo from '@/shared/components/seo/PageSeo'
import styles from './SelectActionPage.module.css'

export default function SelectActionPage() {
  const navigate = useNavigate()
  const { data: me } = useMe()

  const isLoggedIn = !!tokenStorage.get()

  const rightSlot = isLoggedIn ? (
    <button className={styles.myBtn} onClick={() => navigate('/my')} aria-label="마이페이지">
      <span className={styles.myBtnAvatar}>{me?.nickname?.[0] ?? '나'}</span>
    </button>
  ) : undefined

  return (
    <PageLayout showBack={!isLoggedIn} onBack={() => navigate('/')} rightSlot={rightSlot}>
      <PageSeo title="방 선택" />
      <div className={styles.page}>
        <div className={styles.heading}>
          <h1 className={styles.title}>방을 만들어보세요</h1>
          <p className={styles.subtitle}>새 미팅을 만들거나, 초대받은 방에 참가하세요</p>
        </div>

        <div className={styles.cards}>
          {/* 방 만들기 */}
          <button className={`${styles.card} ${styles.cardPrimary}`} onClick={() => navigate('/room/create')}>
            <div className={`${styles.cardIcon} ${styles.cardIconPrimary}`}>
              <svg className={styles.cardIconSvg} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cardTitle}>새 방 만들기</span>
              <span className={styles.cardDesc}>미팅 이름과 날짜를 설정해 방을 만들어요</span>
            </div>
            <svg className={styles.cardArrow} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4l6 6-6 6" />
            </svg>
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>또는</span>
            <span className={styles.dividerLine} />
          </div>

          {/* 방 참가 */}
          <button className={`${styles.card}`} onClick={() => navigate('/room/join')}>
            <div className={`${styles.cardIcon} ${styles.cardIconSecondary}`}>
              <svg className={styles.cardIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cardTitle}>방 참가하기</span>
              <span className={styles.cardDesc}>참여 코드를 입력해 기존 방에 들어가요</span>
            </div>
            <svg className={styles.cardArrow} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
