import { createBrowserRouter } from 'react-router-dom'
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

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <HomePage /> },
  { path: '/callback', element: <CallbackPage /> },
  { path: '/select', element: <SelectActionPage /> },
  { path: '/room/create', element: <CreateRoomPage /> },
  { path: '/room/join', element: <JoinRoomPage /> },
  { path: '/room/:roomId', element: <RoomMainPage /> },
  { path: '/vote/:roomId/entry', element: <ParticipantEntryPage /> },
  { path: '/vote/:roomId/timeslot', element: <TimeslotVotePage /> },
  { path: '/my/rooms', element: <MyRoomsPage /> },
  { path: '/my', element: <MyPage /> },
])

export default router
