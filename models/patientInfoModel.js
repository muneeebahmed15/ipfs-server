const mongoose = require("mongoose");

const patientInfoSchema = mongoose.Schema ({
    admin_id:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },
    fullname:{
        type: String,
        required : [true, "Please add the patient name"],
    },
    fathername:{
        type: String,
        required : [true, "Please add the patient father name"],
    },
    CNIC:{
        type: String,
        required : [true, "Please add the patient CNIC"],
    },
    DOB:{
        type: Date,
        required : [true, "Please add the patient DOB"],
    },
    email:{
        type: String,
        required : [true, "Please add the patient email"],
        unique : [true, "Email address already taken"],   
    },
    gender:{
        type: String,
        required : [true, "Please add the patient gender"],
    },
    phone:{
        type: String,
        required : [true, "Please add the patient phone number"],
    },
    username:{
        type: String,
        required : [true, "Please add the patient username"],
        unique : [true, "Username address already taken"],   
    },
    password:{
        type: String,
        required : [true, "Please add the password for patient login"],
    },
},
    {
        timestamps: true,
    }    
);

module.exports = mongoose.model("PatientInfo", patientInfoSchema);