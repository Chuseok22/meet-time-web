import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './ErrorPage.module.css'

export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const is404 = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.codeWrap}>
          {is404 ? (
            <span className={styles.code}>404</span>
          ) : (
            <div className={styles.iconWrap}>
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="16" cy="16" r="13.5" />
                <path d="M16 10v7M16 20.5v1" />
              </svg>
            </div>
          )}
        </div>

        <h1 className={styles.title}>
          {is404 ? t('error.notFound') : t('error.serverError')}
        </h1>

        <p className={styles.desc}>
          {is404 ? t('error.notFoundDesc') : t('error.serverErrorDesc')}
        </p>

        <div className={styles.actions}>
          <button className={styles.homeBtn} onClick={() => navigate('/', { replace: true })}>
            {t('error.goHome')}
          </button>
          {!is404 && (
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              {t('error.goBack')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
