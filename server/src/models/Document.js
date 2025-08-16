import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
	type: { type: String, enum: ['AADHAAR', 'PAN', 'PHOTO', 'BANK'], required: true },
	filePath: { type: String, required: true },
	meta: { type: Object, default: {} }
}, { timestamps: true });

export default mongoose.model('Document', DocumentSchema)