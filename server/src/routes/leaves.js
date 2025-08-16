import express from 'express';
import Leave from '../models/Leave.js';
import { requireAuth } from '../middleware/auth.js';
import { getAllHigherAuthorities } from '../utils/hierarchy.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
	try {
		const { startDate, endDate, reason } = req.body;
		const notifiedTo = await getAllHigherAuthorities(req.user._id);
		const leave = await Leave.create({ user: req.user._id, company: req.user.company, startDate, endDate, reason, notifiedTo });
		const io = req.app.get('io');
		notifiedTo.forEach((uid) => io.to(String(uid)).emit('leave:requested', { leaveId: leave._id }));
		res.status(201).json({ leave });
	} catch (err) {
		res.status(500).json({ error: 'Failed to apply leave' });
	}
});

router.get('/', requireAuth, async (req, res) => {
	try {
		const filter = req.query.mine ? { user: req.user._id } : { company: req.user.company };
		const leaves = await Leave.find(filter).sort({ createdAt: -1 }).lean();
		res.json({ leaves });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch leaves' });
	}
});

router.post('/:id/approve', requireAuth, async (req, res) => {
	try {
		const leave = await Leave.findById(req.params.id);
		if (!leave) return res.status(404).json({ error: 'Not found' });
		// Only higher authority can approve
		const higher = await getAllHigherAuthorities(leave.user);
		if (!higher.map(String).includes(String(req.user._id))) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		leave.status = 'APPROVED';
		leave.approver = req.user._id;
		await leave.save();
		const io = req.app.get('io');
		io.to(String(leave.user)).emit('leave:approved', { id: leave._id });
		res.json({ leave });
	} catch (err) {
		res.status(500).json({ error: 'Failed to approve leave' });
	}
});

router.post('/:id/reject', requireAuth, async (req, res) => {
	try {
		const leave = await Leave.findById(req.params.id);
		if (!leave) return res.status(404).json({ error: 'Not found' });
		const higher = await getAllHigherAuthorities(leave.user);
		if (!higher.map(String).includes(String(req.user._id))) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		leave.status = 'REJECTED';
		leave.approver = req.user._id;
		await leave.save();
		const io = req.app.get('io');
		io.to(String(leave.user)).emit('leave:rejected', { id: leave._id });
		res.json({ leave });
	} catch (err) {
		res.status(500).json({ error: 'Failed to reject leave' });
	}
});

export default router;