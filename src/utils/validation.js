const validator = require('validator');

const validateSignUpData = (req) => {

  const {firstName, lastName} = req.body;
  if(firstName && lastName) {
    throw new Error("Name is  not valid");
  }
  else if(firstName.length<2 && firstName.length>50) {
    throw new Error("First name should be between 2 and 50 characters");
  }

  else if(!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }

  else if(!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "emailId" , "gender", "age", "about", "skills"];

  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
}
module.exports = {
  validateSignUpData,
  validateEditProfileData,
};