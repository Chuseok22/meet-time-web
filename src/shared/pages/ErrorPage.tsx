import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import styles from './ErrorPage.module.css'

export default function ErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  const is404 =
    isRouteErrorResponse(error) && error.status === 404

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
          {is404 ? '페이지를 찾을 수 없어요' : '문제가 발생했어요'}
        </h1>

        <p className={styles.desc}>
          {is404
            ? '요청하신 페이지가 존재하지 않거나 이동됐어요.'
            : '일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.'}
        </p>

        <div className={styles.actions}>
          <button className={styles.homeBtn} onClick={() => navigate('/', { replace: true })}>
            홈으로 돌아가기
          </button>
          {!is404 && (
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              이전 페이지로
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
