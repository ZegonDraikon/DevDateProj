const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if(validator.isEmail(value)) {
        throw new Error("Email is not valid. Please provide a valid email address");
      }
    } 
  },
  password: {
    type: String,
    required: true,

  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if(!["male", "female", "others"].includes(values)) {
        throw new Error("Invalid gender type");
      }
    }
  },
  photoUrl: {
    type: String,
    validate(value) {
      if(!validator.isURL(value)) {
        throw new Error("Invalid photo URL");
      }
    }
  },
  about: {
    type: String,
    default: "This is the default profile"
  },
  skills: {
    type: [String],
  }

},{
  timestamps: true,
})


module.exports = mongoose.model("User", userSchema);