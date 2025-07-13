import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  username: String,
  email: String,
  avatar: String,
});

export default mongoose.model("User", userSchema);
