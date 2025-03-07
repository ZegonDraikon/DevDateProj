const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {

  const {token} = req.cookies;
  if(!token) {
    return res.status(401).send("Invalid token");
  }
    try {
      const decodedObj = await jwt.verify(token, "DEVTINDER1234");
      const { _id} = decodedObj;
      const user = await User.findById(_id);

      if(!user) {
        throw new Error("User not found");

    }
    req.user = user;  // req.user is now accessible in the routes and controllers.  req.user is an object that contains the user's information.  req.user is not included in the response data.  req.user is only used for authentication and authorization purposes.
    next() ;
    } catch(err) {
      res.status(401).send("Unauthorized. Please login.");  // 401 Unauthorized status code indicates unauthorized access. 403 Forbidden status code is for forbidden access. 400 Bad Request status code is for client-side errors. 500 Server Error status code is for server-side errors.
    }



};

module.exports = {
  userAuth,
};