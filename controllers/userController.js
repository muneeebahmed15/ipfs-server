const asyncHandler = require ("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc register a user
// @route POST /api/users/register
// @access public

const registerUser = asyncHandler(async(req,res) => {
    console.log("Request received at /users/signup");
const {username, password, email} = req.body;
console.log("Received data: ",req.body);
if(!username || !email || !password){
    res.status(400);
    throw new Error("All field are manadatory!");
}

const userAvailable = await User.findOne({email});
if(userAvailable)
{
    res.status(400);
    throw new Error({message : "User already registered"});
}

//hash password
const hashedPassword = await bcrypt.hash(password,10);
console.log("hashpassword", hashedPassword);
const user = await User.create({
    username,
    email, 
    password : hashedPassword,
});
console.log(`User Created ${user}`);
if(user){
    res.status(201).json ({_id : user.id, email : user.email, password : user.password});
}else{
    res.status(400);
    throw new Error("User data is not valid");
}

    res.json({message : "Register the user"});
});

// @desc login a user
// @route POST /api/users/login
// @access public

const loginUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All field are manadatory");
    }
    const user = await User.findOne({email});

    //compare password
    if(user && (await bcrypt.compare(password, user.password)))
        {
            const accessToken = jwt.sign({
                user:{
                    username : user.username,
                    email : user.email,
                    id : user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : "15m"}
            );
            res.status(200).json({accessToken});
        }else{
            res.status(401);
            throw new Eror("Email or password is not valid");
        }
     });

// @desc current user info
// @route POST /api/users/current
// @access private

const currentUser = asyncHandler(async(req,res) => {
    res.json(req.user);
});



module.exports = {registerUser, loginUser, currentUser}