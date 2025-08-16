import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
	lat: { type: Number },
	lng: { type: Number }
}, { _id: false });

const AttendanceSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
	date: { type: String, required: true }, // YYYY-MM-DD
	checkInTime: { type: Date },
	checkInLocation: { type: LocationSchema },
	checkOutTime: { type: Date },
	checkOutLocation: { type: LocationSchema },
	dailyReportSubmitted: { type: Boolean, default: false },
	dailyReportText: { type: String, default: '' }
}, { timestamps: true });

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', AttendanceSchema);