import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [token, setToken] = useState(localStorage.getItem('token') || null)
	useEffect(() => {
		if (token && !user) {
			api.setToken(token)
			api.get('/auth/me').then((res) => setUser(res.data.user)).catch(() => {
				setToken(null)
				localStorage.removeItem('token')
			})
		}
	}, [token])

	const login = async (email, password) => {
		const res = await api.post('/auth/login', { email, password })
		setToken(res.data.token)
		localStorage.setItem('token', res.data.token)
		api.setToken(res.data.token)
		setUser(res.data.user)
	}

	const register = async (payload) => {
		const res = await api.post('/auth/register', payload)
		setToken(res.data.token)
		localStorage.setItem('token', res.data.token)
		api.setToken(res.data.token)
		setUser(res.data.user)
	}

	const logout = () => {
		setToken(null)
		setUser(null)
		localStorage.removeItem('token')
		api.setToken(null)
	}

	return (
		<AuthContext.Provider value={{ user, token, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)