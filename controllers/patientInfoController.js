const asyncHandler = require ("express-async-handler");
const PatientInfo = require ("../models/patientInfoModel");

// @desc get all contacts
// @route GET /api/contacts
// @access private

const getPatientInfos = asyncHandler(async(req,res) => {
    const patientinfo = await PatientInfo.find({user_id : req.user.id});
    res.status(200).json(patientinfo);
});

// @desc Create new contact
// @route POST /api/contact
// @access private

const createPatientInfo = asyncHandler(async(req,res) => {
    console.log("the request body is ", req.body)
    const {fullname, fathername,  CNIC, DOB,  email,  gender,  phone, username,  password}= req.body;
    if(!fullname || !fathername || !CNIC || !DOB || !email || !gender || !phone || !username || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const patientinfo = await PatientInfo.create({
        fullname,fathername,CNIC,DOB,email,gender,phone,username,password,admin_id : req.user.id
    })
    res.status(201).json(patientinfo);
})

// @desc Get contact
// @route GET /api/contact/:id
// @access private

const getPatientInfo = asyncHandler( async(req,res) => {
    const patientinfo = await PatientInfo.findById(req.params.id);
    if(!patientinfo){
        res.status(404);
        throw new Error("Contact not Found");
    }
    res.status(200).json(patientinfo);
})

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

module.exports = {getPatientInfos, createPatientInfo, getPatientInfo, updtePatientInfo, deletePatientInfo}