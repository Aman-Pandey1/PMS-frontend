import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RegisterPage() {
	const { register } = useAuth()
	const navigate = useNavigate()
	const [form, setForm] = useState({ name: '', email: '', password: '' })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const onSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		try {
			await register(form)
			navigate('/')
		} catch (err) {
			setError(err?.response?.data?.error || 'Registration failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth-container">
			<form className="card" onSubmit={onSubmit}>
				<h2>Create account</h2>
				<label>Name</label>
				<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
				<label>Email</label>
				<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
				<label>Password</label>
				<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
				{error && <div className="error">{error}</div>}
				<button disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
				<p>Have an account? <Link to="/login">Login</Link></p>
			</form>
		</div>
	)
}