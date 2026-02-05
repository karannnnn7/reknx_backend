// import mongoose from "mongoose";


// const connectDB = async () => {
//     try {
//         console.log("process.env.MONGODB_URL == ", process.env.MONGODB_URL);

//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/re-knx`)
//         console.log(`\n mongo db connected!!!! DB HOST : ${connectionInstance.connection.host}`);

//     } catch (error) {
//         console.log("mongo db connection error", error);
//         process.exit(1)

//     }
// }
// export default connectDB
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
    throw new Error("❌ MONGODB_URL is not defined in Vercel env");
}

// cache for serverless
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URL, {
                bufferCommands: false,
                serverSelectionTimeoutMS: 5000,
            })
            .then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

export default connectDB;
