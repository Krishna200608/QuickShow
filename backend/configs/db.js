import mongoose from "mongoose";

const connectDB = async () => {
	const databaseName = "quickshow";
	try {
		mongoose.connection.on("connected", () => console.log("MongoDB Connected"));
		await mongoose.connect(`${process.env.MONGODB_URI}/${databaseName}`);
	} catch (error) {
		console.log(error.message);
	}
};

export default connectDB;
