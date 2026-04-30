import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokenStorage } from '@/shared/api/apiClient'

export default function CallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      tokenStorage.set(token)
      navigate('/select', { replace: true })
    } else {
      navigate('/?error=oauth2_failed', { replace: true })
    }
  }, [navigate])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
        로그인 처리 중…
      </p>
    </div>
  )
}
