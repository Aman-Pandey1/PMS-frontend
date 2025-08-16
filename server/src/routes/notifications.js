import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', requireAuth, async (req, res) => {
	try {
		const io = req.app.get('io');
		const userId = String(req.user._id);
		// For REST, we cannot join room directly; client should join via socket handshake. Provide room id back.
		res.json({ room: userId });
	} catch (err) {
		res.status(500).json({ error: 'Failed to subscribe' });
	}
});

export default router;