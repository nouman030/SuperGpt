import mongoose, { Mongoose } from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("DataBase Is Connected")
    );
    await mongoose.connect(`${process.env.MONGO_URI}/supergpt`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
