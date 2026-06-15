import mongoose from "mongoose";

export const connectMongo = () => {
  mongoose
    .connect(process.env.MONGO_URL || "mongodb://localhost:27017/sketchspace")
    .then(() => console.log("MongoDB connected"))
    .catch((e) => console.log("MongoDB not connected", e));
};
