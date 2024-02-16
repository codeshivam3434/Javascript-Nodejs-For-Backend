
const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        // Fetch email from request body
        const { email } = req.body;

        // Check if user already exists
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        // Generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated:", otp);

        // Check unique OTP
        let result = await OTP.findOne({ otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp });
        }

        const otpPayload = { email, otp };

        // Create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // Return successful response
        res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully',
            otp,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error while sending OTP',
        });
    }
};

// Signup
exports.signUp = async (req, res) => {
    try {
        // Data fetch from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            contactNumber,
            otp
        } = req.body;

        // Validate
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Password match check 
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password & ConfirmPassword are not matching",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered",
            });
        }

        // Find most recent OTP stored for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        // Validate OTP
        if (recentOtp.length === 0 || otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user entry in the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        });

        // Return response
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user,
        });

    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: "User cannot be registered. Please try again",
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        // Data fetch
        const { email, password } = req.body;

        // Validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all the details carefully',
            });
        }

        // Check for a registered user
        let user = await User.findOne({ email });

        // If not a registered user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered, please create an account',
            });
        }

        // Verify password & generate a JWT token
        if (await bcrypt.compare(password, user.password)) {
            // Creating payload
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'User Logged In Successfully',
            });
        } else {
            // Password does not match
            return res.status(403).json({
                success: false,
                message: "Password Incorrect",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure! Please try again",
        });
    }
};


// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { userId, password, confirmPassword } = req.body;
        
        if (password === confirmPassword) {
            // Fetch user from the database 
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            
            // Update the password
            user.password = password;
            
            // Save the updated user
            await user.save();
            
            return res.status(200).json({
                success: true,
                message: "Password changed",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword do not match",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(404).json({
            success: false,
            message: "Something went wrong while changing the password",
        });
    }
};

