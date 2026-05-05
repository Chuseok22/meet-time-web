import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'
import i18n from '@/shared/i18n/i18n'
import App from '@/App'

/* html lang 속성을 i18n 언어 변경에 동기화 */
const syncHtmlLang = (lng: string) => {
  document.documentElement.lang = lng.startsWith('ko') ? 'ko' : 'en'
}
syncHtmlLang(i18n.language)
i18n.on('languageChanged', syncHtmlLang)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
