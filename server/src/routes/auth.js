import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const signToken = (user) => {
	return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
};

// Public register - allows creating first SUPER_ADMIN if none exists, else regular flow
router.post('/register', async (req, res) => {
	try {
		const { name, email, password, role, companyId, supervisorId } = req.body;

		const existing = await User.findOne({ email });
		if (existing) return res.status(400).json({ error: 'Email already in use' });

		let effectiveRole = role || 'EMPLOYEE';
		const anySuperAdmin = await User.exists({ role: 'SUPER_ADMIN' });
		if (!anySuperAdmin) effectiveRole = 'SUPER_ADMIN';

		let company = null;
		if (companyId) {
			company = await Company.findById(companyId);
			if (!company) return res.status(400).json({ error: 'Invalid company' });
		}

		const user = await User.create({ name, email, password, role: effectiveRole, company: company?._id || null, supervisor: supervisorId || null });
		const token = signToken(user);
		res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		res.status(500).json({ error: 'Registration failed' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ error: 'Invalid credentials' });
		const ok = await user.comparePassword(password);
		if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
		const token = signToken(user);
		res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		res.status(500).json({ error: 'Login failed' });
	}
});

router.get('/me', requireAuth, async (req, res) => {
	res.json({ user: req.user });
});

export default router;