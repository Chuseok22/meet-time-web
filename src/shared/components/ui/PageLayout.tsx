import { useNavigate } from 'react-router-dom'
import styles from './PageLayout.module.css'

interface PageLayoutProps {
  title?: string
  onBack?: () => void
  showBack?: boolean
  rightSlot?: React.ReactNode
  children: React.ReactNode
}

export default function PageLayout({
  title,
  onBack,
  showBack = true,
  rightSlot,
  children,
}: PageLayoutProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className={styles.layout}>
      {(showBack || title) && (
        <header className={styles.header}>
          {showBack && (
            <button className={styles.backButton} onClick={handleBack} aria-label="뒤로가기">
              <svg className={styles.backIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4l-6 6 6 6" />
              </svg>
            </button>
          )}
          {title && <h2 className={styles.headerTitle}>{title}</h2>}
          <div className={styles.headerRight}>{rightSlot}</div>
        </header>
      )}
      <main className={styles.body}>{children}</main>
    </div>
  )
}
