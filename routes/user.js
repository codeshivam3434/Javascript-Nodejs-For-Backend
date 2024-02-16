
const express = require("express");
const router = express.Router();

const { signUp } = require("../controllers/Auth"); // Fix the function name to match the exported function
const { login } = require("../controllers/Auth");
const { resetPassword } = require("../controllers/ResetPasswords");
const { changePassword } = require("../controllers/Auth");
const { sendOTP } = require("../controllers/Auth");
const{resetPasswordToken}=require("../controllers/ResetPasswords");

router.post("/signup", signUp); // Use the corrected function name
router.post("/login", login);
router.post("/update-password", resetPassword);
router.post("/changePassword", changePassword);
router.post("/sendOtp", sendOTP);
router.post("/resetPasswordToken",resetPasswordToken);

module.exports = router;
