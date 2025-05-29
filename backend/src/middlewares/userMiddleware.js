const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
require('dotenv').config({path:__dirname+'/./../../.env'})

const userMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check for Bearer token
   // if (!authHeader || !authHeader.startsWith('Bearer ')) {
     //   return res.status(401).json({ message: 'Unauthorized: No token provided' });
    //}

    //const token = authHeader.replace(/^Bearer /, '');
    const token = req.cookies?.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        console.log('Decoded token ID:', decoded.id);
        // Attach user to request
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = userMiddleware;
