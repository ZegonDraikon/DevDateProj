const mongoose=require('mongoose');
const connectDB=async()=>{
    await mongoose.connect(
        'mongodb+srv://Zegon:NBP#2424nbp@cluster0.d1svu.mongodb.net/'
    
    );
};

module.exports = connectDB;
