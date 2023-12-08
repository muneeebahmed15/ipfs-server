const express = require("express");
const router = express.Router();
const {getPatientInfos, createPatientInfo,
getPatientInfo, updtePatientInfo, deletePatientInfo} = require("../controllers/patientInfoController");
const validateToken = require("../middleware/validateTokenHandler");


router.use(validateToken);

router.get("/",getPatientInfos);

router.post("/createpatientlogin",createPatientInfo);

router.get("/:id",getPatientInfo);

router.put("/:id",updtePatientInfo);

router.delete("/:id",deletePatientInfo);

module.exports = router;