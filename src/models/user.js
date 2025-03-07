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
    enum: {
      values: ['male', 'female', 'other'],
      message: `{VALUE} is not valid`
    },
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
  },
  

},{
  timestamps: true,
});

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({
    _id: userSchema._id
  },
"DEVTINDER1234", {
  expires: "7d",
});
return token;
}

userSchema.methods.validatePassword = async function () {

  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.comapre(password, passwordHash);
};

module.exports = mongoose.model("User", userSchema);