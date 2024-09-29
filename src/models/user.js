const mongoose=require('mongoose');
 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    emailId:{
        type: String,
    },
    age:{
        type: Number,
    },
})

module.exports=mongoose.model('User',userSchema);


