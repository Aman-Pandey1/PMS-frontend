import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
	const { login } = useAuth()
	const navigate = useNavigate()
	const [form, setForm] = useState({ email: '', password: '' })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const onSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		try {
			await login(form.email, form.password)
			navigate('/')
		} catch (err) {
			setError(err?.response?.data?.error || 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth-container">
			<form className="card" onSubmit={onSubmit}>
				<h2>Welcome back</h2>
				<label>Email</label>
				<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
				<label>Password</label>
				<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
				{error && <div className="error">{error}</div>}
				<button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
				<p>No account? <Link to="/register">Register</Link></p>
			</form>
		</div>
	)
}