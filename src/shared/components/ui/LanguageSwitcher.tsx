import { useLocale } from '@/shared/hooks/useLocale'
import styles from './LanguageSwitcher.module.css'

export default function LanguageSwitcher() {
  const { locale, toggleLocale } = useLocale()

  return (
    <button
      className={styles.switcher}
      onClick={toggleLocale}
      aria-label={locale === 'ko' ? 'Switch to English' : '한국어로 변경'}
    >
      {locale === 'ko' ? 'EN' : 'KO'}
    </button>
  )
}
