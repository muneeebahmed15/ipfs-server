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
    // console.log("the request body is ", req.body)

    const {fullname, fathername,  CNIC, DOB,  email,  gender,  phone, username,  password, role}= req.body;

    if(!fullname || !fathername || !CNIC || !DOB || !email || !gender || !phone || !username || !password || !role){
        res.status(400).json({error:"All fields are mandatory!"});
    }
        const userAvailable = await PatientInfo.findOne({CNIC})
        if(userAvailable){
            res.status(409).json({error:"Patient already registered"});
        }else{
        const hashedPassword = await bcrypt.hash(password,10);

    const patientinfo = await PatientInfo.create({
        fullname,fathername,CNIC,DOB,email,gender,phone,username,password:hashedPassword, role ,admin_id : req.user.id
    })

    if(patientinfo){
    res.status(200).json({msg:"Patient registered successfully"});}
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

const getPatientByCnic = asyncHandler(async (req, res) => {
  const { cnic } = req.params;
  
  try {
      const patientinfo = await PatientInfo.findOne({ CNIC: cnic }).populate("admin_id").populate("healthRecord").populate({
        path:"healthRecord",
        populate:{path:"doctor_id"}});;

      if (!patientinfo) {
          return res.status(404).json({msg:"Patient not found"});
      } 

          return res.status(200).json(patientinfo);
      
  } catch (error) {
      // Handle any errors that might occur during the database query
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
  }
});


const getPatientByName = asyncHandler(async (req, res) => {
  const { name } = req.params;
     const Name = new RegExp(name, 'i');
  
  try {
      const patientinfo = await PatientInfo.find({ fullname: Name });

      if (!patientinfo) {
          return res.status(404).json({msg:"Patient not found"});
      } 

          return res.status(200).json(patientinfo);
      
  } catch (error) {
      // Handle any errors that might occur during the database query
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
  }
});


// const getPatientBycnic = asyncHandler( async(req,res) => {
//     const {cnic} = req.params;

//   const patientinfo = await PatientInfo.find({CNIC:cnic});

//   if(patientinfo){
//       res.status(200).json(patientinfo);
//   }else{
//    return res.status(404).json({msg:"Patient not found"});
//   }

// })

//@desc add heath record
//@route  PUT /patient/add-health-record
//@access private

const GetHealthRecord = async (req, res, next) => {
  const { _id } = req.params;

  const healthinfo = await PatientHealth.find({ patient_id : _id}).populate("admin_id").populate("doctor_id");
  if(healthinfo){
    res.status(200).json({healthinfo});
  }else{
    res.status(404).json({msg:"No record found"});
  }
};

const addPatientHealthRecord = async (req, res, next) => {
  try {
      const { patient_id, doctor_id, problem, suggestion, futureVisit } = req.body;

      if (!patient_id || !doctor_id || !problem || !suggestion || !futureVisit) {
          return res.status(400).json({ error: "All fields are manadatory" });
      }

      const newHealthRecord = new PatientHealth({
          patient_id,
          doctor_id,
          admin_id : req.user.id,
          problem,
          suggestion,
          futureVisit,
          createdAt: new Date(),
      });

      const savedHealthRecord = await newHealthRecord.save();

      const patient = await PatientInfo.findById(patient_id);

      if (!patient) {
          return res.status(404).json({ error: "Patient not found" });
      }

      patient.healthRecord.push(savedHealthRecord._id);
      await patient.save();

      return res.status(200).json({
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


const loginPatient = asyncHandler(async(req,res) => {
    const {CNIC, password} = req.body;

    if(!CNIC || !password){
        res.status(400).json({error:"All field are manadatory"});
    }

    const user = await PatientInfo.findOne({ CNIC });
    // console.log(user)
    if(!user){
        res.status(404).json({error:"User not found"});
    }

    //compare password
    if(user && (await bcrypt.compare(password, user.password)))
        {
            const token = jwt.sign({
                user:{
                    CNIC : user.CNIC,
                    id : user.id},
                 },
            process.env.ACCESS_TOKEN_SECRET );
           
            res.status(200).json({token, user});
        }else{
          return res.status(401).json({error:"Email or password is not valid"});
        }
     });

 const currentUser = asyncHandler(async(req,res) => {
        try {
            const _user = await PatientInfo.findOne({ _id: req.user.id }).populate("healthRecord");
            if (_user) {

                const healthRecordIds = _user.healthRecord;
                const healthRecords = await PatientHealth.find({ _id: { $in: healthRecordIds } });
                _user.healthRecord = healthRecords;

              return res.status(200).json({ _user});
            }
          } catch (error) {
            next(error);
          }
    });

    const loadUser = async(req, res, next)=>{
        const {_id} = req.params;

        try {
            const user = await PatientInfo.findById( {_id }).populate("healthRecord");
            if (user) {
            // const healthRecordIds = user.healthRecord;
            return res.status(200).json( user);
                }else {
                    return res.status(404).json({ error: 'User not found' });
                }
                } 
                catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });

        }

    }

    const patientWithDoctorRegistered = async (req, res, next)=>{
      const {id} = req.params;

      try {
        const user = await PatientInfo.findById( {id }).populate("healthRecord");
        if (user) {
        // const healthRecordIds = user.healthRecord;
        return res.status(200).json( user);
            }else {
                return res.status(404).json({ error: 'User not found' });
            }
            } 
            catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });

    }

    }

 


    const updatePassword = async (req, res) => {
  // Get the user's current password from the request body
  const { currentPassword, newPassword } = req.body;

  // Find the user by their ID
  try {
    const user = await PatientInfo.findById(req.user.id);

  // Validate the current password
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({
      error: 'Current password is incorrect',
    });
  }

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  // Update the user's password
  user.password = hashedPassword;
  await user.save();
  // Return a success response
  res.json({
    message: 'Password updated successfully',
  });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });

  }
  
};



module.exports = {getPatientInfos,
                getPatientByName,
                 getPatientByCnic,
                  createPatientInfo, 
                  getPatientInfo, 
                  updtePatientInfo, 
                  deletePatientInfo,
                  GetHealthRecord,
                   addPatientHealthRecord,
                   loginPatient,
                   currentUser,
                   loadUser,
                   updatePassword
                }