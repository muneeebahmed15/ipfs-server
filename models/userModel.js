const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    adminname:{
        type: String,
        required : [true, "Please add the admin name"],
    },
    username:{
    type : String,
    required : [true, "Please add the username"],
    unique : [true, "username address already taken"],   
    },
    email:{
        type : String,
        required : [true, "Please add the email address"],
        unique : [true, "Email address already taken"],    
    },
    password:{
        type : String,
        required : [true, "Please add the user password"],
    },},
    {
        timestamps : true,
    }
    );


    module.exports = mongoose.model("User", userSchema);