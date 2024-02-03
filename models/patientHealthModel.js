const mongoose = require("mongoose");

const patientHealth = new mongoose.Schema({
     patient_id:{ type : mongoose.Schema.Types.ObjectId,  required : true, ref : "PatientInfo" },
    
     admin_id:{ type : mongoose.Schema.Types.ObjectId,  required : true, ref : "Admin" },
    
     doctor_id:{ type : mongoose.Schema.Types.ObjectId,  required : true, ref : "DoctorInfo" },
    
     problem: { type: String, required: true },

     suggestion: { type: String, required: true },
    
     futureVisit: { type: String, required: true },
},{
    timestamps:true,
})

const PatientHealth = mongoose.model("PatientHealth", patientHealth);
module.exports = PatientHealth;