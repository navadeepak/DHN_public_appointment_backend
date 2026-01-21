import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Mongo DB Connected Sucessfully");
  } catch (error) {
    console.error(error.message);
    process.exit(1)
  }
};

export default connectDB;
