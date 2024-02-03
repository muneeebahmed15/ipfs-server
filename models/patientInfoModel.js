const mongoose = require("mongoose");

const patientInfoSchema = mongoose.Schema ({
    admin_id:{ type : mongoose.Schema.Types.ObjectId,  required : true, ref : "Admin" },
    
  // doctor_id:{ type : mongoose.Schema.Types.ObjectId,  required : true, ref : "Admin" },
    
    role:{ type: String, enum : ['patient' ] },
     
    fullname:{ type: String, required : true },

    fathername:{ type: String, required : true },

    CNIC:{ type: String, required : true },

    DOB:{ type: Date, required : true },

    email:{ type: String, required : true, unique : true },

    gender:{ type: String,  required : true },

    phone:{ type: String, required : true },

    username:{ type: String, required : true, unique : true },

    password:{ type: String, required : true },

    healthRecord : [{ type: mongoose.Schema.Types.ObjectId, ref:"PatientHealth" }]
},
    {
        timestamps: true,
    }    
);

const PatientInfo = mongoose.model("PatientInfo", patientInfoSchema);
module.exports = PatientInfo;