import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';
import connectDb from './config/db.js';
import authRoutes from './routes/auth.js';
import companyRoutes from './routes/companies.js';
import userRoutes from './routes/users.js';
import attendanceRoutes from './routes/attendance.js';
import leaveRoutes from './routes/leaves.js';
import taskRoutes from './routes/tasks.js';
import documentRoutes from './routes/documents.js';
import salaryRoutes from './routes/salaries.js';
import notificationRoutes from './routes/notifications.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new SocketIOServer(server, {
	cors: {
		origin: process.env.CORS_ORIGIN || '*',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
	}
});

// Attach io to app for routes to emit events if needed
app.set('io', io);

// DB connection
await connectDb();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Static for uploads
const uploadsDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Health
app.get('/api/health', (req, res) => {
	res.json({ ok: true, uptime: process.uptime() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// Socket.io basic events
io.on('connection', (socket) => {
	try {
		const token = socket.handshake?.auth?.token || socket.handshake?.query?.token;
		if (token) {
			const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
			const userRoom = String(decoded.id);
			socket.join(userRoom);
		}
	} catch (_) {
		// ignore invalid tokens for socket connections
	}
	socket.on('disconnect', () => {
		// cleanup if needed
	});
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});