import mongoose from 'mongoose';

const TaskUpdateSchema = new mongoose.Schema({
	by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	text: { type: String, required: true },
	at: { type: Date, default: Date.now }
}, { _id: false });

const TaskSchema = new mongoose.Schema({
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
	assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	description: { type: String, required: true },
	deadline: { type: Date },
	priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
	status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'DONE', 'BLOCKED'], default: 'OPEN' },
	updates: { type: [TaskUpdateSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);