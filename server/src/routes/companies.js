import express from 'express';
import Company from '../models/Company.js';
import { requireAuth, requireRoles, Roles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
	try {
		if (req.user.role === Roles.SUPER_ADMIN) {
			const companies = await Company.find({}).lean();
			return res.json({ companies });
		}
		if (req.user.company) {
			const company = await Company.findById(req.user.company).lean();
			return res.json({ companies: company ? [company] : [] });
		}
		return res.json({ companies: [] });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch companies' });
	}
});

router.post('/', requireAuth, requireRoles(Roles.SUPER_ADMIN), async (req, res) => {
	try {
		const { name, approvedLocations } = req.body;
		const company = await Company.create({ name, approvedLocations: approvedLocations || [], createdBy: req.user._id });
		res.status(201).json({ company });
	} catch (err) {
		res.status(500).json({ error: 'Failed to create company' });
	}
});

router.put('/:id', requireAuth, requireRoles(Roles.SUPER_ADMIN), async (req, res) => {
	try {
		const { name, approvedLocations } = req.body;
		const company = await Company.findByIdAndUpdate(req.params.id, { name, approvedLocations }, { new: true });
		res.json({ company });
	} catch (err) {
		res.status(500).json({ error: 'Failed to update company' });
	}
});

router.delete('/:id', requireAuth, requireRoles(Roles.SUPER_ADMIN), async (req, res) => {
	try {
		await Company.findByIdAndDelete(req.params.id);
		res.json({ ok: true });
	} catch (err) {
		res.status(500).json({ error: 'Failed to delete company' });
	}
});

export default router;