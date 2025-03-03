import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailCode: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false, //email verifiaction
    },
    emailAuthenticate: {
      type: Boolean,
      default: false,
    },

    twoFASecret: {
      type: String, // 2fa secret
    },
    
    isTwoFAEnabled: {
      type: Boolean,
      default: false,
    },
    twoFACode: {
      type: String, // 2fa code
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
