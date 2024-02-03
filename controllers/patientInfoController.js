const asyncHandler = require ("express-async-handler");
const PatientInfo = require ("../models/patientInfoModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PatientHealth = require("../models/patientHealthModel");
const Admin = require("../models/adminModel");


// @desc get all contacts
// @route GET /api/contacts
// @access private

const getPatientInfos = asyncHandler(async(req,res) => {
    const patientinfo = await PatientInfo.find();
    res.status(200).json(patientinfo);
});

// @desc Create new contact
// @route POST /api/contact
// @access private

const createPatientInfo = asyncHandler(async(req,res) => {
    console.log("the request body is ", req.body)

    const {fullname, fathername,  CNIC, DOB,  email,  gender,  phone, username,  password, role}= req.body;

    if(!fullname || !fathername || !CNIC || !DOB || !email || !gender || !phone || !username || !password || !role){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
        const userAvailable = await PatientInfo.findOne({CNIC})
        if(userAvailable){
            res.status(400).json({msg:"Patient already registered"});
        }else{

        const hashedPassword = await bcrypt.hash(password,10);
        console.log("hashpassword", hashedPassword);

    const patientinfo = await PatientInfo.create({
        fullname,fathername,CNIC,DOB,email,gender,phone,username,password:hashedPassword, role ,admin_id : req.user.id
    })

    if(patientinfo){
    res.status(201).json(patientinfo);}
    else{
        res.status(400).json({error:"Data is not valid"});
    }
}
})

// @desc Get contact
// @route GET /api/contact/:id
// @access private

const getPatientInfo = asyncHandler( async(req,res) => {
    const { _id } = req.params;

    const patientinfo = await PatientInfo.findOne({ _id }).populate("admin_id").populate("healthRecord").populate({
        path:"healthRecord",
        populate:{path:"doctor_id"}});

    if(!patientinfo){
        res.status(404).json("Patient not Found");
    }

    res.status(200).json(patientinfo);
})

//@desc add heath record
//@route  PUT /patient/add-health-record
//@access private

const addPatientHealthRecord = async (req, res, next) => {
    try {
      const { patient_id,doctor_id, problem, suggestion, futureVisit } = req.body;
      
      if (!patient_id || !doctor_id || !problem || !suggestion || !futureVisit) {
        return next(errorHandler(400, "Invalid inputs"));
      }
  
    //   const patient = await PatientInfo.findById(patient_id).populate("healthRecord");
      
    //   if (!patient) {
    //     return next(errorHandler(400, "Invalid Patient ID"));
    //   }
  
      const user = await Admin.findById(req.user.id);
      if (!user) {
        return next(errorHandler(400, "Not found"));
      }
  
      // Create a health-record comment
      const newHealthRecord = new PatientHealth({
        patient_id,
        doctor_id,
        problem,
        suggestion,
        futureVisit,
        admin_id: req.user.id,
        createdAt: new Date(),
      });
      const savedHealthRecord = await newHealthRecord.save();
  
      // Add  the comment to the ticket
    //  $push:{healthRecord:savedHealthRecord._id};

    await PatientInfo.findByIdAndUpdate(patient_id, {
        $push: { healthRecord: savedHealthRecord._id },
    });

    //   await patient.save();
  
      return res.status(200).json({
        ok: true,
        healthRecord: savedHealthRecord,
      });
    } catch (error) {
      next(error);
    }
  };


// @desc Update contact
// @route PUT /api/contact/:id
// @access private
const updtePatientInfo = asyncHandler( async(req,res) => {
    const patientinfo = await PatientInfo.findById(req.params.id);
    if(!patientinfo){
        res.status(404);
        throw new Error("Contact not Found");
    }

     if(patientinfo.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error ("user don't have permission to update other contancts");
     }

    const updatedpatientinfo = await PatientInfo.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    );

    res.status(200).json(updatedpatientinfo);
})


// @desc Delete contact
// @route DELETE /api/contact/:id
// @access private

const deletePatientInfo = asyncHandler( async (req,res) => {
    const patientinfo = await PatientInfo.findById(req.params.id);
    if(!patientinfo){
        res.status(404);
        throw new Error("Contact not Found");
    }

    if(patientinfo.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error ("user don't have permission to remove other contancts");
     }

    await PatientInfo.deleteOne({_id : req.params.id});

    res.status(200).json(patientinfo);
});

module.exports = {getPatientInfos, createPatientInfo, getPatientInfo, updtePatientInfo, deletePatientInfo, addPatientHealthRecord}