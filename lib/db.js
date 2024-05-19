import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const instance = await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MONGODB connection SUCCESS", instance.connection.host);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export { connectDB };
