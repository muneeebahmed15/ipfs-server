const express = require("express");
const {registerDoctor, loginDoctor, currentUser} = require("../controllers/doctorInfoController");
const { validateToken, isAdmin, isDoctor } = require("../middleware/validateTokenHandler");


const router = express.Router();

router.post("/register",validateToken, isAdmin, registerDoctor);

router.post ("/login",  loginDoctor);

router.get("/current", validateToken,isDoctor, currentUser);


module.exports = router;