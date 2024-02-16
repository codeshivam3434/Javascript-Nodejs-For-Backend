
const jwt = require("jsonwebtoken");
const cors = require('cors');
require("dotenv").config();

exports.authorized = async (req, res, next) => {
    try {
        // Extract JWT token from the request headers or cookies
        const token = req.headers.authorization || req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next(); // Move to the next middleware or route handler
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying the token",
        });
    }
};

// CORS middleware
exports.corsMiddleware = cors();
