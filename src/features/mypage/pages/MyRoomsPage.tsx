import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageLayout from '@/shared/components/ui/PageLayout'
import PageSeo from '@/shared/components/seo/PageSeo'
import { useMyRooms } from '@/features/room/hooks/useRoom'
import { tokenStorage } from '@/shared/api/apiClient'
import type { MyRoom } from '@/features/room/types/room.types'
import styles from './MyRoomsPage.module.css'

type Tab = 'created' | 'joined'

export default function MyRoomsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
    <PageLayout title={t('myRooms.pageTitle')} showBack onBack={() => navigate('/my')}>
      <PageSeo title={t('myRooms.pageTitle')} noIndex />
      <div className={styles.page}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'created' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('created')}
          >
            {t('myRooms.createdTab')} {!isLoading && <span>({createdRooms.length})</span>}
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'joined' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('joined')}
          >
            {t('myRooms.joinedTab')} {!isLoading && <span>({joinedRooms.length})</span>}
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>{t('common.loading')}</div>
        ) : displayRooms.length === 0 ? (
          <EmptyState tab={activeTab} onAction={() => navigate(activeTab === 'created' ? '/room/create' : '/room/join')} />
        ) : (
          <div className={styles.list}>
            {displayRooms.map(room => (
              <div key={room.roomId} className={styles.roomCard} onClick={() => handleRoomClick(room.roomId)}>
                <div className={styles.roomCardTop}>
                  <span className={styles.roomTitle}>{room.title}</span>
                  {room.isOwner && <span className={styles.ownerBadge}>{t('myRooms.ownerBadge')}</span>}
                </div>
                <div className={styles.roomCardBottom}>
                  <div className={styles.codeRow}>
                    <span className={styles.codeLabel}>{t('myRooms.codeLabel')}</span>
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
  const { t } = useTranslation()
  const isCreated = tab === 'created'
  return (
    <div className={styles.empty}>
      <svg className={styles.emptyIcon} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="32" height="26" rx="3" />
        <path d="M4 16h32M13 4v8M27 4v8" />
      </svg>
      <span className={styles.emptyTitle}>
        {isCreated ? t('myRooms.emptyCreated') : t('myRooms.emptyJoined')}
      </span>
      <span className={styles.emptyDesc}>
        {isCreated
          ? t('myRooms.emptyCreatedDesc')
          : t('myRooms.emptyJoinedDesc')}
      </span>
      <button className={styles.emptyBtn} onClick={onAction}>
        {isCreated ? t('myRooms.emptyCreatedAction') : t('myRooms.emptyJoinedAction')}
      </button>
    </div>
  )
}
