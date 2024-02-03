const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/userController");

const {validateToken, isAdmin} = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken,isAdmin, currentUser);


module.exports = router;