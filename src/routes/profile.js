const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {  
      const user = req.user;
      if (!user) return res.status(404).send("User not found");
      res.send(user);
  } catch (err) {
      res.status(400).send("Error fetching profile: " + err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req,res) => {
  try {

    validateEditProfileData(req);
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser
    });
  } catch (err) {
    return res.status(400).send("Invalid profile data: " + err.message);
  }
});

module.exports = profileRouter;