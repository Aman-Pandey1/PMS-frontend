import express from 'express';
import Salary from '../models/Salary.js';
import { requireAuth, requireRoles, Roles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requireRoles(Roles.SUPER_ADMIN, Roles.COMPANY_ADMIN), async (req, res) => {
	try {
		const filter = req.user.role === Roles.SUPER_ADMIN ? (req.query.companyId ? { company: req.query.companyId } : {}) : { company: req.user.company };
		const salaries = await Salary.find(filter).populate('user', 'name email role').lean();
		const totalPayable = salaries.reduce((sum, s) => sum + (s.baseSalary || 0), 0);
		res.json({ salaries, totalPayable });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch salaries' });
	}
});

router.post('/', requireAuth, requireRoles(Roles.SUPER_ADMIN, Roles.COMPANY_ADMIN), async (req, res) => {
	try {
		const { user, baseSalary, securityAmount, designation } = req.body;
		const payload = { user, baseSalary, securityAmount, designation, company: req.user.company };
		const salary = await Salary.findOneAndUpdate({ user }, payload, { upsert: true, new: true, setDefaultsOnInsert: true });
		res.status(201).json({ salary });
	} catch (err) {
		res.status(500).json({ error: 'Failed to upsert salary' });
	}
});

export default router;