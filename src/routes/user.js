const mongoose = require('mongoose');

const userSchema = new mongoose.model({
  firstName: {
    type : String
  },
  lastName: {
    type: String
  },
})

const userModel =  mongoose.model("User", userSchema);
module.exports = userModel;