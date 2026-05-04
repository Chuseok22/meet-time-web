import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/shared/components/ui/PageLayout'
import PageSeo from '@/shared/components/seo/PageSeo'
import { useMyRooms } from '@/features/room/hooks/useRoom'
import { tokenStorage } from '@/shared/api/apiClient'
import type { MyRoom } from '@/features/room/types/room.types'
import styles from './MyRoomsPage.module.css'

type Tab = 'created' | 'joined'

export default function MyRoomsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('created')

  const { data: rooms, isLoading } = useMyRooms()

  /* 로그인 필수 */
  if (!tokenStorage.get()) {
    navigate('/', { replace: true })
    return null
  }

  const createdRooms = rooms?.filter(r => r.isOwner) ?? []
  const joinedRooms = rooms?.filter(r => !r.isOwner) ?? []
  const displayRooms: MyRoom[] = activeTab === 'created' ? createdRooms : joinedRooms

  const handleRoomClick = (roomId: string) => {
    navigate(`/room/${roomId}`)
  }

  return (
    <PageLayout title="내 방 목록" showBack onBack={() => navigate('/select')}>
      <PageSeo title="내 방 목록" noIndex />
      <div className={styles.page}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'created' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('created')}
          >
            내가 만든 방 {!isLoading && <span>({createdRooms.length})</span>}
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'joined' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('joined')}
          >
            참여한 방 {!isLoading && <span>({joinedRooms.length})</span>}
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : displayRooms.length === 0 ? (
          <EmptyState tab={activeTab} onAction={() => navigate(activeTab === 'created' ? '/room/create' : '/room/join')} />
        ) : (
          <div className={styles.list}>
            {displayRooms.map(room => (
              <div key={room.roomId} className={styles.roomCard} onClick={() => handleRoomClick(room.roomId)}>
                <div className={styles.roomCardTop}>
                  <span className={styles.roomTitle}>{room.title}</span>
                  {room.isOwner && <span className={styles.ownerBadge}>방장</span>}
                </div>
                <div className={styles.roomCardBottom}>
                  <div className={styles.codeRow}>
                    <span className={styles.codeLabel}>코드</span>
                    <span className={styles.codeValue}>{room.joinCode}</span>
                  </div>
                  <svg className={styles.arrowIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4l4 4-4 4" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}

function EmptyState({ tab, onAction }: { tab: Tab; onAction: () => void }) {
  const isCreated = tab === 'created'
  return (
    <div className={styles.empty}>
      <svg className={styles.emptyIcon} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="32" height="26" rx="3" />
        <path d="M4 16h32M13 4v8M27 4v8" />
      </svg>
      <span className={styles.emptyTitle}>
        {isCreated ? '만든 방이 없어요' : '참여한 방이 없어요'}
      </span>
      <span className={styles.emptyDesc}>
        {isCreated
          ? '새 방을 만들고 팀원들과 일정을 잡아보세요'
          : '참여 코드를 입력해서 방에 들어가 보세요'}
      </span>
      <button className={styles.emptyBtn} onClick={onAction}>
        {isCreated ? '방 만들기' : '방 참가하기'}
      </button>
    </div>
  )
}
