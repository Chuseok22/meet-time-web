import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/features/auth/pages/HomePage'
import SelectActionPage from '@/features/room/pages/SelectActionPage'
import CreateRoomPage from '@/features/room/pages/CreateRoomPage'
import JoinRoomPage from '@/features/room/pages/JoinRoomPage'
import ParticipantEntryPage from '@/features/vote/pages/ParticipantEntryPage'
import TimeslotVotePage from '@/features/vote/pages/TimeslotVotePage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/select', element: <SelectActionPage /> },
  { path: '/room/create', element: <CreateRoomPage /> },
  { path: '/room/join', element: <JoinRoomPage /> },
  { path: '/vote/:roomId/entry', element: <ParticipantEntryPage /> },
  { path: '/vote/:roomId/timeslot', element: <TimeslotVotePage /> },
  // 추후 추가
  // { path: '/callback', element: <CallbackPage /> },
  // { path: '/room/:roomId', element: <RoomMainPage /> },
  // { path: '/my/rooms', element: <MyRoomsPage /> },
  // { path: '/my', element: <MyPage /> },
])

export default router
