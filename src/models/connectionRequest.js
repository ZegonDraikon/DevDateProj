const mongoose = require("mongoose");

const connectionRequestSchema = new Mongoose.Schema({

  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId
  },
  status: {
    type: String,
    enum: {
      values: ["ignore", "interested", "accepted", "rejected"],
      message: `{values} is incorrect status type`
    }   
  }
}, {
  timestamps: true,
}
);

connectionRequestSchema.index({ fromUserId: 1, toUserId:1});

connectionRequestSchema.pre('save', function(next) {
  const connectionRequest = this;
  if(connectionRequest.fromUserId.equals(connectoinRequest.toUserId)) {
    throw new error("Cannot send connection request to yourself");
  }
  next();
})

const connectionRequest = new mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequestModel;