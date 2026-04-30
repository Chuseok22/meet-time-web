import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/features/auth/pages/HomePage'
import SelectActionPage from '@/features/room/pages/SelectActionPage'
import CreateRoomPage from '@/features/room/pages/CreateRoomPage'
import JoinRoomPage from '@/features/room/pages/JoinRoomPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/select', element: <SelectActionPage /> },
  { path: '/room/create', element: <CreateRoomPage /> },
  { path: '/room/join', element: <JoinRoomPage /> },
  // 추후 추가
  // { path: '/callback', element: <CallbackPage /> },
  // { path: '/room/:roomId', element: <RoomMainPage /> },
  // { path: '/vote/:roomId', element: <VotePage /> },
  // { path: '/my/rooms', element: <MyRoomsPage /> },
  // { path: '/my', element: <MyPage /> },
])

export default router
