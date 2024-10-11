const mongoose=require('mongoose');
const connectDB=async()=>{
    await mongoose.connect(
        'mongodb+srv://niyamparekh:niyam1234@cluster0.2jgzk.mongodb.net/'
    
    );
};

module.exports = connectDB;
