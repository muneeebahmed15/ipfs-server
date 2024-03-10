const mongoose = require("mongoose");

const doctorInfoSchema = mongoose.Schema ({
    admin_id:{ type : mongoose.Schema.Types.ObjectId,  required : true, ref : "Admin" },
    
    role:{ type: String, enum : ['doctor' ] },
    
    fullname: { type: String, required : true },

    fathername:{ type: String, required : true },

    CNIC:{ type: String, required : true, unique : true },

    DOB:{ type: Date, required : true },

    email:{  type: String, required : true, unique : true },

    gender:{ type: String, required : true },

    phone:{ type: String, required : true },

    username:{ type: String, required : true },

    password:{ type: String, required : true },
},
    {
        timestamps: true,
    }    
);

const DoctorInfo = mongoose.model("DoctorInfo", doctorInfoSchema);

module.exports = DoctorInfo;
