import mongoose from "mongoose";

// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    // await mongoose.connect(process.env.MONGO_URI, clientOptions)
    // await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('database connection successful.')
}

export default connectDB;
