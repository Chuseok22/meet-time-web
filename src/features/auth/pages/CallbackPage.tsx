import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import PageSeo from '@/shared/components/seo/PageSeo'
import { tokenStorage } from '@/shared/api/apiClient'
import { userKeys } from '@/features/auth/hooks/useUser'
import styles from './CallbackPage.module.css'

export default function CallbackPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      tokenStorage.set(token)
      /* 로그인 직후 useMe 캐시 무효화 → SelectActionPage에서 최신 사용자 정보 즉시 반영 */
      queryClient.invalidateQueries({ queryKey: userKeys.me })
      navigate('/select', { replace: true })
    } else {
      navigate('/login?error=oauth2_failed', { replace: true })
    }
  }, [navigate, queryClient])

  return (
    <div className={styles.page}>
      <PageSeo noIndex />
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.text}>로그인 처리 중…</p>
    </div>
  )
}
