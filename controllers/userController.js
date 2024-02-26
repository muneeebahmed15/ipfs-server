const asyncHandler = require ("express-async-handler");
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc register a user
// @route POST /api/users/register
// @access public

const registerUser = asyncHandler(async(req,res) => {
    console.log("Request received at /users/signup");

const {name, email, password,role } = req.body;
console.log("Received data: ",req.body);

if(!name || !email || !password || !role){
    res.status(400);
    throw new Error("All field are manadatory!");
}

const userAvailable = await Admin.findOne({email});
if(userAvailable)
{
    res.status(400).json({msg: "User already registered"});
}

//hash password
const hashedPassword = await bcrypt.hash(password,10);
console.log("hashpassword", hashedPassword);


const user = await Admin.create({ name, email,  role, password : hashedPassword,});
console.log(`User Created ${user}`);


if(user){
    res.status(201).json ({msg: "User created successfully.."});//{_id : user.id, email : user.email, password : user.password}
}else{
    res.status(400).json({error: "User data is not valid"});
}
});

// @desc login a user
// @route POST /api/users/login
// @access public

const loginUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400).json("All field are manadatory");
    }
    const user = await Admin.findOne({ email });
    if(!user){
        res.status(404).json("User not found");
    }

    //compare password
    if(user && (await bcrypt.compare(password, user.password)))
        {
            const token = jwt.sign({
                user:{
                    email : user.email,
                    id : user.id,}, },
            process.env.ACCESS_TOKEN_SECRET );
           
            res.status(200).json({token, user});
        }else{
            res.status(401).json("Email or password is not valid");
        }
     });

// @desc current user info
// @route POST /api/users/current
// @access private

const currentUser = asyncHandler(async(req,res) => {
    try {
        const _user = await Admin.findOne({ _id: req.user.id });
        if (_user) {
          return res.status(200).json({ _user });
        }
      } catch (error) {
        next(error);
      }
});



module.exports = {registerUser, loginUser, currentUser}