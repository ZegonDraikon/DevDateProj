const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {

  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ['ignored', 'interested'];
    if(allowedStatus.includes(status)) {
      return res.status(400).send({message: " Invalid status type: " +status});
    }

    

    const toUser = await User.findBy(toUserId);
    if(!toUser) {
      return res.status(400).json({message: "User not found"});
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or:[
        {fromUserId , toUserId},
        { fromUserId, toUserId: fromUserId},
      ] 
    });

    if(existingConnectionRequest) {
      return res.status(400).send({message: "Connection Request Already exists"});
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    })

    const data = await connectionRequest.save();
    res.json({
      message: req.user.firstName+ "is " +status + "in "
    })
  } catch(err)  {
    res.status(400).send('ERROR: '+ err.message);
  }
  const user = req.user;
  console.log("sending a connection request");
  res.send(user.firstName + 'Send the connect request');
})

module.exports = requestRouter;

