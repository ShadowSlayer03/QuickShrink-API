import mongoose from 'mongoose';

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB Successfully!");
    } catch (error) {
        console.log("Error occurred in connecting to DataBase:", error);
    }
}

export default connectDB;