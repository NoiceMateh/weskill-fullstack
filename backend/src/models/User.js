import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, unique: true, required: true },
    phone: { type: String, trim: true, default: "" },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
    isActive: { type: Boolean, default: true },
    jobStatus: { type: String, enum: ["seeking", "employed", "unknown"], default: "unknown" },
    refreshTokenHash: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
