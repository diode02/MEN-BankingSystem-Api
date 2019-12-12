const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Transaction = require("./transaction");
require("../mongod/connect");
//for creating a chema AND SETTTING UP MIDDLE WARE for hashing
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  cnic: {
    type: Number,
    required: true
  },
  dob: {
    type: String,
    default: "09-09-2009"
  },
  gender: {
    type: String,
    default: "shemale"
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.virtual("tasks", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "owner"
});

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this._id.toString() }, "biryani0biryani");
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.checkCradentials = async (email, password) => {
  const user = await User.findOne({ email, password });
  if (!user) throw new Error("Unable To Login");
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
