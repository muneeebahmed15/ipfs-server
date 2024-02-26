const asyncHandler = require ("express-async-handler");
const DoctorInfo = require ("../models/DoctorInfoModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerDoctor = asyncHandler(async(req,res)=>{
    const {fullname, fathername,  CNIC, DOB,  email,  gender,  phone, username,  password, role}= req.body;
    console.log(req.body);

    if(!fullname || !fathername || !CNIC || !DOB || !email || !gender || !phone || !username || !password || !role){
        res.status(400).json({error:"All field are mandatory!"});
    }
    const userAvailable = await DoctorInfo.findOne({email});
    
if(userAvailable)
{
    // console.log("user registered")
    res.status(400).json("User already registered");
}

//hash password
const hashedPassword = await bcrypt.hash(password,10);
// console.log("hashpassword", hashedPassword);


    const doctorinfo = await DoctorInfo.create({
        fullname, fathername, CNIC, DOB, email, gender, phone, username, password: hashedPassword, role ,Admin_id : req.user.id
    });
    console.log("user created")
    
    if(doctorinfo){
        res.status(201).json({msg:"Doctor Credentials created successfully" })
    }
    else{
        res.status(400).json({msg:"User data is not valid"});
    }

});



const loginDoctor = asyncHandler(async(req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400).json({error:"All field are manadatory"});
    }
    const user = await DoctorInfo.findOne({ email });
    if(!user){
        res.status(404).json({error:"User not found"});
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
            res.status(401).json({error:"Email or password is not valid"});
        }
     });


     
     const currentUser = asyncHandler(async(req,res) => {
        try {
            const _user = await DoctorInfo.findOne({ _id: req.user.id });
            if (_user) {
              return res.status(200).json({ _user });
            }
          } catch (error) {
            next(error);
          }
    });

module.exports = {registerDoctor, loginDoctor, currentUser}
