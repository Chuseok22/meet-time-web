import { useTranslation } from 'react-i18next'

export function useLocale() {
  const { i18n } = useTranslation()
  const locale = i18n.language.startsWith('ko') ? 'ko' : 'en'

  const toggleLocale = () => {
    i18n.changeLanguage(locale === 'ko' ? 'en' : 'ko')
  }

  return { locale, toggleLocale }
}
