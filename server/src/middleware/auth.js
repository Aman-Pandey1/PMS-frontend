import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const Roles = {
	SUPER_ADMIN: 'SUPER_ADMIN',
	COMPANY_ADMIN: 'COMPANY_ADMIN',
	SUPERVISOR: 'SUPERVISOR',
	EMPLOYEE: 'EMPLOYEE'
};

export const requireAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || '';
		const token = authHeader.startsWith('Bearer ')
			? authHeader.substring(7)
			: (req.cookies && req.cookies.token) || null;
		if (!token) return res.status(401).json({ error: 'Unauthorized' });

		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
		const user = await User.findById(decoded.id).select('-password');
		if (!user) return res.status(401).json({ error: 'Invalid token' });
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
};

export const requireRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		next();
	};
};