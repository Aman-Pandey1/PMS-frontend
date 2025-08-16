import mongoose from 'mongoose';

const ApprovedLocationSchema = new mongoose.Schema({
	name: { type: String },
	lat: { type: Number, required: true },
	lng: { type: Number, required: true },
	radiusMeters: { type: Number, required: true, default: 150 }
}, { _id: false });

const CompanySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true, trim: true },
	approvedLocations: { type: [ApprovedLocationSchema], default: [] },
	admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Company', CompanySchema);