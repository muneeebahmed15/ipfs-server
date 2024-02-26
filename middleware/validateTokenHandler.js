const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const DoctorInfo = require("../models/DoctorInfoModel");
const PatientInfo = require("../models/patientInfoModel");
const errorHandler = require("./errorHandler");

const validateToken = asyncHandler(async(req, res, next) =>{
     let token;
     let authHeader = req.headers.authorization || req.headers.Authorization;
     if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
      
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded) =>{
            if(err){
                res.status(401);
                throw new Error("User is not Authorized from tokenhandler");
            }
            req.user = decoded.user ;
            next();  
        });
    }
        else{
            res.status(403).json({error:"Forbidden from tokenhandler"});
        }
    
});


//   admin
  const isAdmin = async (req, res, next) => {
    try {
      const user = await Admin.findById(req.user.id);
      if (user.role !== "admin") {
        return res.status(401).json({message:"Not allowed"});
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
    }
  };

//doctor
const isDoctor = async(req, res, next)=>{
    try {
        const user = await DoctorInfo.findById(req.user.id);
        if(user.role !== "doctor"){
            return next(errorHandler(401, "Not Allowed"))
        }
        else{
            next()
        }
    } catch (error) {
        console.log(error);
    }
};

//patient
const isPatient = async(req, res, next)=>{
    try {
        const user = await PatientInfo.findById(req.user.id);
        if(user.role !== "patient"){
            return next(errorHandler(401, "Not Allowed"))
        }
        else{
            next()
        }
    } catch (error) {
        console.log(error);
    }
};



module.exports = {validateToken, isAdmin, isDoctor, isPatient};