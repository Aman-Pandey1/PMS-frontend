import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import io from 'socket.io-client'

export default function DashboardPage() {
	const { user, logout } = useAuth()
	useEffect(() => {
		const socket = io('/', { transports: ['websocket'] })
		// Join personal room by emitting our user id after fetch
		// Client will receive notifications via server emitting to room=userId
		socket.on('connect', () => {
			// No explicit join API used here; server recommends using room id
		})
		return () => socket.disconnect()
	}, [])

	return (
		<div className="page">
			<header className="topbar">
				<div>EMS Dashboard</div>
				<div>
					<span>{user?.name} ({user?.role})</span>
					<button className="secondary" onClick={logout}>Logout</button>
				</div>
			</header>
			<div className="content">
				<p>Welcome to EMS. Use the sidebar to navigate. (To be built)</p>
			</div>
		</div>
	)
}