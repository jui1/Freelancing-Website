const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const tokenHeader = req.header('Authorization');

    if (!tokenHeader || !tokenHeader.startsWith('Bearer')) {
        return res.status(401).send('Access denied. No token provided.');
    }

    const token = tokenHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).send('Access denied. User not found.');
        }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('Access denied. Token has expired.');
        }
        res.status(400).send('Invalid token.');
    }
};



const role = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send('Access denied.');
        }
        next();
    };
};

module.exports =
{ 
    auth,role
}