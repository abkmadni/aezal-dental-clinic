const mongoose = require('mongoose');
require('dotenv').config({path:__dirname+'/./../../.env'})


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;