
// const User = require("../models/User");
// const mailSender = require("../utils/mailSender");
// const crypto = require('crypto');


// // Reset password token
// exports.resetPasswordToken = async (req, res) => {
//     try {
//         // Get email from req body
//         const email = req.body.email;

//         // Check user for this email, email validation
//         const user = await User.findOne({ email: email });
//         if (!user) {
//             return res.json({
//                 success: false,
//                 message: "Your Email is not registered with us ",
//             });
//         }

//         // Generate token
//         const token = crypto.randomUUID();

//         // Update user by adding token and expiration time
//         const updatedDetails = await User.findOneAndUpdate(
//             { email: email },
//             {
//                 token: token,
//                 resetPasswordExpires: Date.now() + 3600000,
//             },
//             { new: true }
//         );

//         // Create URL
//         const url = `http://localhost:3000/update-password/${token}`;

//         // Send mail containing the URL
//         await mailSender(email, "password reset link", `Password reset link: ${url}`);

//         return res.json({
//             success: true,
//             message: "Email sent successfully, please check email and change password",
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Something is wrong while sending reset password mail",
//         });
//     }
// };

// // Reset password
// exports.resetPassword = async (req, res) => {
//     try {
//         // Data fetch
//         const { password, confirmPassword, token } = req.body;

//         // Validation
//         if (password !== confirmPassword) {
//             return res.json({
//                 success: false,
//                 message: "Passwords do not match",
//             });
//         }

//         // Get user details from DB using token
//         const userDetails = await User.findOne({ token: token });

//         // If no entry - invalid token
//         if (!userDetails || userDetails.resetPasswordExpires > Date.now()) {
//             return res.json({
//                 success: false,
//                 message: "Link expired, please regenerate your token",
//             });
//         }
//         console.log("shivam");
//         // Hash password
//         // const hashedPassword = await bcrypt.hash(password, 10);
//         // console.log(hashedPassword);
//         const bcrypt = require('bcrypt');
//         const saltRounds = 10; // Number of salt rounds for hashing
        
        
//         const salt = bcrypt.genSaltSync(saltRounds);
//         const hashedPassword = bcrypt.hashSync(Password, salt);
        
//         console.log(hashedPassword);
        
        

//         // Password update
//         await User.findOneAndUpdate(
//             { token: token },
//             { password: hashedPassword },
//             { new: true }
//         );

//         // Return response
//         return res.json({
//             success: true,
//             message: "Password reset successful",
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Something is wrong while resetting the password",
//         });
//     }
// };
const User = require("../models/User");
const mailSender = require("../utils/mailSender");


// Reset password token
exports.resetPasswordToken = async (req, res) => {
    try {
        // Get email from req body
        const email = req.body.email;

        // Check user for this email, email validation
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: "Your Email is not registered with us ",
            });
        }

        // Generate token
        const token = crypto.randomUUID();

        // Update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000,
            },
            { new: true }
        );
        console.log(updatedDetails)

        // Create URL
        const url = `http://localhost:3000/update-password/${token}`;

        // Send mail containing the URL
        await mailSender(email, "password reset link", `Password reset link: ${url}`);

        return res.json({
            success: true,
            message: "Email sent successfully, please check email and change password",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something is wrong while sending reset password mail",
        });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        // Data fetch
        const { password, confirmPassword, token } = req.body;

        // Validation
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Get user details from DB using token
        const userDetails = await User.findOne({ token: token });
        console.log(userDetails)
        
        // If no entry - invalid token
        if (!userDetails || userDetails.resetPasswordExpires > Date.now()) {
            return res.json({
                success: false,
                message: "Link expired, please regenerate your token",

            });
        }
        
        // Hash password
                const bcrypt = require('bcrypt');
                const saltRounds = 10; // Number of salt rounds for hashing
                
                
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPassword = bcrypt.hashSync(password, salt);

        // Password update
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true }
        );

        // Return response
        return res.json({
            success: true,
            message: "Password reset successful",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something is wrong while resetting the password",
        });
    }
};

