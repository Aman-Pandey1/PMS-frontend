import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const USER_ROLES = ['SUPER_ADMIN', 'COMPANY_ADMIN', 'SUPERVISOR', 'EMPLOYEE'];

const ApprovedLocationSchema = new mongoose.Schema({
	name: { type: String },
	lat: { type: Number, required: true },
	lng: { type: Number, required: true },
	radiusMeters: { type: Number, required: true, default: 150 }
}, { _id: false });

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	password: { type: String, required: true, minlength: 6 },
	role: { type: String, enum: USER_ROLES, required: true, default: 'EMPLOYEE' },
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
	supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	designation: { type: String, default: '' },
	approvedLocations: { type: [ApprovedLocationSchema], default: [] },
	isActive: { type: Boolean, default: true }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.comparePassword = async function(candidate) {
	return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', UserSchema);