import express from 'express';
import User from '../models/User.js';
import Company from '../models/Company.js';
import { requireAuth, requireRoles, Roles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requireRoles(Roles.SUPER_ADMIN, Roles.COMPANY_ADMIN), async (req, res) => {
	try {
		const filter = req.user.role === Roles.SUPER_ADMIN ? {} : { company: req.user.company };
		const users = await User.find(filter).select('-password').populate('supervisor', 'name email').lean();
		res.json({ users });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch users' });
	}
});

router.post('/', requireAuth, requireRoles(Roles.SUPER_ADMIN, Roles.COMPANY_ADMIN), async (req, res) => {
	try {
		const { name, email, password, role, supervisorId } = req.body;
		let companyId = req.user.company;
		if (req.user.role === Roles.SUPER_ADMIN && req.body.companyId) {
			companyId = req.body.companyId;
			const c = await Company.findById(companyId);
			if (!c) return res.status(400).json({ error: 'Invalid company' });
		}
		const user = await User.create({ name, email, password, role: role || 'EMPLOYEE', company: companyId || null, supervisor: supervisorId || null });
		res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		res.status(500).json({ error: 'Failed to create user' });
	}
});

export default router;