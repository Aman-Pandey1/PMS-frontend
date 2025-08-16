import express from 'express';
import Task from '../models/Task.js';
import { requireAuth } from '../middleware/auth.js';
import { isDirectSubordinate, getAllHigherAuthorities } from '../utils/hierarchy.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
	try {
		const { assignedTo, description, deadline, priority } = req.body;
		const allowed = await isDirectSubordinate(req.user._id, assignedTo);
		if (!allowed) return res.status(403).json({ error: 'Can only assign to direct subordinate' });
		const task = await Task.create({
			company: req.user.company,
			assignedBy: req.user._id,
			assignedTo,
			description,
			deadline,
			priority
		});
		const io = req.app.get('io');
		io.to(String(assignedTo)).emit('task:assigned', { id: task._id });
		const higher = await getAllHigherAuthorities(assignedTo);
		higher.forEach((uid) => io.to(String(uid)).emit('task:assigned', { id: task._id }));
		res.status(201).json({ task });
	} catch (err) {
		res.status(500).json({ error: 'Failed to create task' });
	}
});

router.get('/', requireAuth, async (req, res) => {
	try {
		const tasks = await Task.find({ $or: [ { assignedTo: req.user._id }, { assignedBy: req.user._id } ] }).sort({ createdAt: -1 }).lean();
		res.json({ tasks });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch tasks' });
	}
});

router.post('/:id/update', requireAuth, async (req, res) => {
	try {
		const { text, status } = req.body;
		const task = await Task.findById(req.params.id);
		if (!task) return res.status(404).json({ error: 'Not found' });
		if (String(task.assignedTo) !== String(req.user._id) && String(task.assignedBy) !== String(req.user._id)) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		if (text) task.updates.push({ by: req.user._id, text });
		if (status) task.status = status;
		await task.save();
		const io = req.app.get('io');
		io.to(String(task.assignedBy)).emit('task:updated', { id: task._id });
		io.to(String(task.assignedTo)).emit('task:updated', { id: task._id });
		res.json({ task });
	} catch (err) {
		res.status(500).json({ error: 'Failed to update task' });
	}
});

export default router;