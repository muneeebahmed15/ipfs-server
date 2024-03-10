const express = require("express");
const {registerDoctor, loginDoctor, currentUser, AllDoctor} = require("../controllers/doctorInfoController");
const { validateToken, isAdmin, isDoctor } = require("../middleware/validateTokenHandler");


const router = express.Router();

router.post("/register",validateToken, isAdmin, registerDoctor);

router.post ("/login",  loginDoctor);

router.get("/all-doctors", validateToken, isAdmin, AllDoctor);

router.get("/current", validateToken,isDoctor, currentUser);


module.exports = router;