import express from 'express';
import dayjs from 'dayjs';
import Attendance from '../models/Attendance.js';
import Company from '../models/Company.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const isWithinApproved = (lat, lng, approvedLocations = []) => {
	if (approvedLocations.length === 0) return true; // fallback: allow if not configured
	const toRad = (v) => (v * Math.PI) / 180;
	const R = 6371000; // meters
	for (const loc of approvedLocations) {
		const dLat = toRad(lat - loc.lat);
		const dLon = toRad(lng - loc.lng);
		const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(loc.lat)) * Math.cos(toRad(lat)) * Math.sin(dLon / 2) ** 2;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c;
		if (distance <= (loc.radiusMeters || 150)) return true;
	}
	return false;
};

router.post('/check-in', requireAuth, async (req, res) => {
	try {
		const { lat, lng } = req.body;
		const today = dayjs().format('YYYY-MM-DD');
		const company = await Company.findById(req.user.company).lean();
		if (!company) return res.status(400).json({ error: 'Company not set' });
		if (!isWithinApproved(lat, lng, company.approvedLocations || [])) {
			return res.status(400).json({ error: 'Not within approved location' });
		}
		const existing = await Attendance.findOne({ user: req.user._id, date: today });
		if (existing && existing.checkInTime) return res.status(400).json({ error: 'Already checked in' });
		const record = await Attendance.findOneAndUpdate(
			{ user: req.user._id, date: today },
			{ $setOnInsert: { company: req.user.company, checkInTime: new Date(), checkInLocation: { lat, lng } } },
			{ upsert: true, new: true }
		);
		res.json({ attendance: record });
	} catch (err) {
		res.status(500).json({ error: 'Check-in failed' });
	}
});

router.post('/report', requireAuth, async (req, res) => {
	try {
		const { text } = req.body;
		const today = dayjs().format('YYYY-MM-DD');
		const record = await Attendance.findOneAndUpdate(
			{ user: req.user._id, date: today },
			{ $set: { dailyReportSubmitted: true, dailyReportText: text || '' } },
			{ new: true }
		);
		if (!record) return res.status(400).json({ error: 'No attendance record' });
		res.json({ attendance: record });
	} catch (err) {
		res.status(500).json({ error: 'Report submit failed' });
	}
});

router.post('/check-out', requireAuth, async (req, res) => {
	try {
		const { lat, lng } = req.body;
		const today = dayjs().format('YYYY-MM-DD');
		const record = await Attendance.findOne({ user: req.user._id, date: today });
		if (!record || !record.checkInTime) return res.status(400).json({ error: 'Not checked in' });
		if (!record.dailyReportSubmitted) return res.status(400).json({ error: 'Submit daily report before checkout' });
		const company = await Company.findById(req.user.company).lean();
		if (!isWithinApproved(lat, lng, company?.approvedLocations || [])) {
			return res.status(400).json({ error: 'Not within approved location' });
		}
		record.checkOutTime = new Date();
		record.checkOutLocation = { lat, lng };
		await record.save();
		res.json({ attendance: record });
	} catch (err) {
		res.status(500).json({ error: 'Check-out failed' });
	}
});

export default router;