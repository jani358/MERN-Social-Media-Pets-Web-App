const jwt = require("jsonwebtoken"); // Importing the jsonwebtoken library
const User = require("../models/User"); // Importing the User model

// Middleware to check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies; // Extracting the token from request cookies
        
        // If token is not present, user is not logged in
        if (!token) {
            return res.status(401).json({
                message: "Please Login First"
            });
        }
        
        // Verifying and decoding the token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Finding the user based on the decoded user ID from the token
        req.user = await User.findById(decoded._id);
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If any error occurs, send a 500 Internal Server Error response
        res.status(500).json({
            message: error.message
        });
    }
};
