import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { tokenStorage } from '@/shared/api/apiClient'
import HomePage from '@/features/auth/pages/HomePage'
import CallbackPage from '@/features/auth/pages/CallbackPage'
import SelectActionPage from '@/features/room/pages/SelectActionPage'
import CreateRoomPage from '@/features/room/pages/CreateRoomPage'
import JoinRoomPage from '@/features/room/pages/JoinRoomPage'
import RoomMainPage from '@/features/room/pages/RoomMainPage'
import ParticipantEntryPage from '@/features/vote/pages/ParticipantEntryPage'
import TimeslotVotePage from '@/features/vote/pages/TimeslotVotePage'
import MyRoomsPage from '@/features/mypage/pages/MyRoomsPage'
import MyPage from '@/features/mypage/pages/MyPage'
import ErrorPage from '@/shared/pages/ErrorPage'

/* 비로그인 전용 라우트 — 토큰이 있으면 /select로 이동 */
function GuestRoute({ children }: { children: ReactNode }) {
  if (tokenStorage.get()) return <Navigate to="/select" replace />
  return <>{children}</>
}

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <GuestRoute><HomePage /></GuestRoute> },
      { path: '/login', element: <GuestRoute><HomePage /></GuestRoute> },
      { path: '/callback', element: <CallbackPage /> },
      { path: '/select', element: <SelectActionPage /> },
      { path: '/room/create', element: <CreateRoomPage /> },
      { path: '/room/join', element: <JoinRoomPage /> },
      { path: '/room/:roomId', element: <RoomMainPage /> },
      { path: '/vote/:roomId/entry', element: <ParticipantEntryPage /> },
      { path: '/vote/:roomId/timeslot', element: <TimeslotVotePage /> },
      { path: '/my/rooms', element: <MyRoomsPage /> },
      { path: '/my', element: <MyPage /> },
      { path: '*', element: <ErrorPage /> },
    ],
  },
])

export default router
