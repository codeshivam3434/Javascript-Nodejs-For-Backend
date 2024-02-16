
const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5*60*60, // Set expiration time in seconds
    },
});

// Sending OTP using mailSender
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Email from Cash Flow Sentry", otp);
        console.log("Email sent successfully", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending the OTP mail", error);
        throw error;
    }
}

// Pre-save hook to send verification email
OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model("OTP", OTPSchema);
