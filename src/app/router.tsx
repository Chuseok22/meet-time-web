import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/features/auth/pages/HomePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  // 추후 페이지 추가 예정
  // { path: '/callback', element: <CallbackPage /> },
  // { path: '/select', element: <SelectPage /> },
  // { path: '/room/create', element: <CreateRoomPage /> },
  // { path: '/room/join', element: <JoinRoomPage /> },
  // { path: '/room/:roomId', element: <RoomMainPage /> },
  // { path: '/vote/:roomId', element: <VotePage /> },
  // { path: '/my/rooms', element: <MyRoomsPage /> },
  // { path: '/my', element: <MyPage /> },
])

export default router
