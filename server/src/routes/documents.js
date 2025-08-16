import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Document from '../models/Document.js';
import { requireAuth, requireRoles, Roles } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(null, `${Date.now()}-${req.user?._id || 'anon'}${ext}`);
	}
});

const upload = multer({ storage });

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
	try {
		const { type } = req.body;
		if (!req.file) return res.status(400).json({ error: 'File required' });
		const doc = await Document.create({ user: req.user._id, company: req.user.company, type, filePath: `/uploads/${path.basename(req.file.path)}` });
		res.status(201).json({ document: doc });
	} catch (err) {
		res.status(500).json({ error: 'Upload failed' });
	}
});

router.get('/', requireAuth, async (req, res) => {
	try {
		let filter = {};
		if (req.user.role === Roles.SUPER_ADMIN) {
			filter = { company: req.query.companyId || req.user.company };
		} else {
			filter = { user: req.user._id };
		}
		const documents = await Document.find(filter).sort({ createdAt: -1 }).lean();
		res.json({ documents });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch documents' });
	}
});

export default router;