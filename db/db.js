import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}/re-knx`)
        console.log(`\n mongo db connected!!!! DB HOST : ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("mongo db connection error", error);
        process.exit(1)
        
    }
}
export default connectDB