import mongoose from 'mongoose';

const connectDb = async () => {
	const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ems';
	mongoose.set('strictQuery', true);
	await mongoose.connect(mongoUri, {
		serverSelectionTimeoutMS: 15000
	});
	console.log('MongoDB connected');
};

export default connectDb;