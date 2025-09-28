import mongoose, { Date, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

type user = {
  _id: mongoose.Types.ObjectId;
  username?: string;
  email?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<user>(
  {
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const USER = models?.USER || mongoose.model("USER", userSchema);
export default USER;
