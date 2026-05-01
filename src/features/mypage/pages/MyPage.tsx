import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/shared/components/ui/PageLayout'
import { useMe, useDeleteMe } from '@/features/auth/hooks/useUser'
import { tokenStorage } from '@/shared/api/apiClient'
import { ApiException } from '@/shared/types/api.types'
import styles from './MyPage.module.css'

export default function MyPage() {
  const navigate = useNavigate()
  const { data: me, isLoading } = useMe()
  const deleteMe = useDeleteMe()
  const isLoggedIn = tokenStorage.get() !== null

  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)
  const [withdrawError, setWithdrawError] = useState('')

  const handleLogout = () => {
    tokenStorage.remove()
    navigate('/', { replace: true })
  }

  const handleWithdrawConfirm = async () => {
    setWithdrawError('')
    try {
      await deleteMe.mutateAsync()
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiException) {
        setWithdrawError(err.errorMessage)
      } else {
        setWithdrawError('탈퇴 처리 중 오류가 발생했어요. 다시 시도해 주세요.')
      }
    }
  }

  return (
    <PageLayout title="마이페이지" showBack onBack={() => navigate('/select')}>
      <div className={styles.page}>
        {!isLoggedIn ? (
          <div className={styles.loginPrompt}>
            <svg className={styles.loginPromptIcon} viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="22" cy="16" r="8" />
              <path d="M6 40c0-8.837 7.163-16 16-16s16 7.163 16 16" />
            </svg>
            <span className={styles.loginPromptTitle}>로그인이 필요해요</span>
            <span className={styles.loginPromptDesc}>
              소셜 계정으로 로그인하면 방 목록 관리, 투표 기록 확인 등을 이용할 수 있어요
            </span>
            <button className={styles.loginBtn} onClick={() => navigate('/')}>
              로그인하러 가기
            </button>
          </div>
        ) : isLoading ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : me ? (
          <>
            {/* 프로필 카드 */}
            <div className={styles.profileCard}>
              <div className={styles.avatar}>{me.nickname[0]}</div>
              <div className={styles.profileInfo}>
                <span className={styles.nickname}>{me.nickname}</span>
                <span className={styles.email}>{me.email}</span>
              </div>
            </div>

            {/* 일반 메뉴 */}
            <div className={styles.section}>
              <button className={styles.menuItem} onClick={() => navigate('/my/rooms')}>
                <svg className={styles.menuIcon} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1.5" y="3" width="15" height="12" rx="2" />
                  <path d="M1.5 7h15M5 1.5v3M13 1.5v3" />
                </svg>
                <span className={styles.menuLabel}>내 방 목록</span>
                <svg className={styles.menuArrow} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3l4 4-4 4" />
                </svg>
              </button>
            </div>

            {/* 계정 메뉴 */}
            <div className={styles.section}>
              <button className={styles.menuItem} onClick={handleLogout}>
                <svg className={styles.menuIcon} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.5 9h8M12 6l3 3-3 3" />
                  <path d="M10 2H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h7" />
                </svg>
                <span className={styles.menuLabel}>로그아웃</span>
                <svg className={styles.menuArrow} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3l4 4-4 4" />
                </svg>
              </button>
              <button className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => setShowWithdrawConfirm(true)}>
                <svg className={styles.menuIcon} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="7" r="3.5" />
                  <path d="M2.5 16.5c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" />
                  <path d="M13 3l3 3M16 3l-3 3" />
                </svg>
                <span className={styles.menuLabel}>회원 탈퇴</span>
                <svg className={styles.menuArrow} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 3l4 4-4 4" />
                </svg>
              </button>
            </div>
          </>
        ) : null}

        <div className={styles.footer}>Meet Time</div>
      </div>

      {/* 탈퇴 확인 모달 */}
      {showWithdrawConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowWithdrawConfirm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9.5" />
                <path d="M12 7v5M12 15.5v.5" />
              </svg>
            </div>
            <h3 className={styles.modalTitle}>정말 탈퇴하시겠어요?</h3>
            <p className={styles.modalDesc}>
              탈퇴 시 계정 정보와 투표 기록이 모두 삭제돼요. 이미 만든 방과 참여 기록은 복구할 수 없어요.
            </p>
            {withdrawError && (
              <p className={styles.modalError}>{withdrawError}</p>
            )}
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => { setShowWithdrawConfirm(false); setWithdrawError('') }}
                disabled={deleteMe.isPending}
              >
                취소
              </button>
              <button
                className={styles.modalConfirmBtn}
                onClick={handleWithdrawConfirm}
                disabled={deleteMe.isPending}
              >
                {deleteMe.isPending ? '처리 중…' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
