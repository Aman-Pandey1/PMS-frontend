import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	reason: { type: String, required: true },
	status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
	approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	notifiedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Leave', LeaveSchema);