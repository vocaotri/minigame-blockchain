const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    status: { type: Boolean, default: false },
    address_wallet: { type: String },
    winner: {
      type: String,
      enum: ["waiting", "won50", "won100"],
      default: "waiting",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
