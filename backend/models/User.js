const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    averagePrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    walletBalance: { type: Number, default: 100000, min: 0 },
    holdings: { type: [holdingSchema], default: [] },
  },
  { timestamps: true, optimisticConcurrency: true },
);

// Hash password only when it is changed, so normal profile updates stay fast.
userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
