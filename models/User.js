
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true, // Fix typo: it should be "required" instead of "require"
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true
    },
    token:{
        type:String,
        trim:true
        
    }
});

module.exports = mongoose.model("User", userSchema);
