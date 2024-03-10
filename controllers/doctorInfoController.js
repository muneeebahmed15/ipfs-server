const asyncHandler = require ("express-async-handler");
const DoctorInfo = require ("../models/DoctorInfoModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerDoctor = asyncHandler(async(req,res)=>{
    const {fullname, fathername,  CNIC, DOB,  email,  gender,  phone, username,  password, role}= req.body;
    

    if(!fullname || !fathername || !CNIC || !DOB || !email || !gender || !phone || !username || !password || !role){
        res.status(400).json({error:"All field are mandatory!"});
    }
    const userAvailable = await DoctorInfo.findOne({email});
    const userCNIC = await DoctorInfo.findOne({CNIC});
    
if(userAvailable)
{
    res.status(409).json("User already registered");
}else if(userCNIC){
    res.status(409).json("User already registered");
}
else{
const hashedPassword = await bcrypt.hash(password,10);

    const doctorinfo = await DoctorInfo.create({
        fullname, fathername, CNIC, DOB, email, gender, phone, username, password: hashedPassword, role ,admin_id : req.user.id
    });
    
    if(doctorinfo){
        res.status(200).json({msg:"Doctor Credentials created successfully" })
    }
    else{
        res.status(400).json({msg:"User data is not valid"});
    }
}
});



const loginDoctor = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are mandatory" });
        }

        const user = await DoctorInfo.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = jwt.sign(
                {
                    user: {
                        email: user.email,
                        id: user.id,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET
            );

            return res.status(200).json({ token, user });
        } else {
            return res.status(401).json({ error: "Email or password is not valid" });
        }
    } catch (error) {
        console.error("Error in loginDoctor:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

const AllDoctor = async(req, res) =>{

   try {
     const AllDoctor = await DoctorInfo.find()

     if(AllDoctor){
        res.status(200).json(AllDoctor);
     }else{
        res.status(404).json({msg:"No doctor found"})
     }
   } catch (error) {
        res.status(500).json({error:"Internal server error"})
   }
}
     
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

module.exports = {registerDoctor, loginDoctor, AllDoctor, currentUser}
