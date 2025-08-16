import mongoose from 'mongoose';

const SalarySchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
	baseSalary: { type: Number, required: true, default: 0 },
	securityAmount: { type: Number, required: true, default: 0 },
	designation: { type: String, default: '' },
	lastPaidAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Salary', SalarySchema);