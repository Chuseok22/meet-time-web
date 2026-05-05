import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageLayout from '@/shared/components/ui/PageLayout'
import { useMe } from '@/features/auth/hooks/useUser'
import { tokenStorage } from '@/shared/api/apiClient'
import PageSeo from '@/shared/components/seo/PageSeo'
import AdBanner from '@/shared/components/ui/AdBanner'
import LanguageSwitcher from '@/shared/components/ui/LanguageSwitcher'
import styles from './SelectActionPage.module.css'

export default function SelectActionPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: me } = useMe()

  const isLoggedIn = !!tokenStorage.get()

  const rightSlot = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <LanguageSwitcher />
      {isLoggedIn && (
        <button className={styles.myBtn} onClick={() => navigate('/my')} aria-label={t('common.myPage')}>
          <span className={styles.myBtnAvatar}>{me?.nickname?.[0] ?? '나'}</span>
        </button>
      )}
    </div>
  )

  return (
    <PageLayout showBack={!isLoggedIn} onBack={() => navigate('/')} rightSlot={rightSlot}>
      <PageSeo title={t('select.pageTitle')} />
      <div className={styles.page}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{t('select.heading')}</h1>
          <p className={styles.subtitle}>{t('select.subtitle')}</p>
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
              <span className={styles.cardTitle}>{t('select.createRoom')}</span>
              <span className={styles.cardDesc}>{t('select.createRoomDesc')}</span>
            </div>
            <svg className={styles.cardArrow} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4l6 6-6 6" />
            </svg>
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>{t('common.or')}</span>
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
              <span className={styles.cardTitle}>{t('select.joinRoom')}</span>
              <span className={styles.cardDesc}>{t('select.joinRoomDesc')}</span>
            </div>
            <svg className={styles.cardArrow} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4l6 6-6 6" />
            </svg>
          </button>
        </div>

        <AdBanner adSlot="2005475130" />
      </div>
    </PageLayout>
  )
}
