import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userShcema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profileImage: {
    type: String,
    default: "",
  },
},
{
    timestamps: true
}); // Add timestamps to track creation and update times

// hash password before saving user to db

userShcema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // Check if password is modified
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Proceed to save the user
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

// Method to compare password
userShcema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password); // Compare the candidate password with the hashed password
  } catch (error) {
    throw new Error("Password comparison failed"); // Handle any error that occurs during comparison
  }
};

const User = mongoose.model("User", userShcema);
export default User;
