import { Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

const PrivateRoute = ({ children }) => {
	const { user } = useAuth()
	return user ? children : <Navigate to="/login" />
}

export default function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</AuthProvider>
	)
}