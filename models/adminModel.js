const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    name:{ type: String, required : true  },
  
    role:{ type: String, enum : ['admin' ] },

    email:{ type : String, required : true, unique : true, },

    password:{ type : String,  required : true },
},
    {
        timestamps : true,
    }
    );

    const Admin = mongoose.model("Admin", adminSchema);
    module.exports = Admin;