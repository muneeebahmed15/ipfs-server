const express = require("express");
const router = express.Router();
const {getPatientInfos, createPatientInfo,
getPatientInfo, updtePatientInfo, deletePatientInfo, addPatientHealthRecord} = require("../controllers/patientInfoController");
const {validateToken, isAdmin} = require("../middleware/validateTokenHandler");


router.use(validateToken);

router.get("/get-all-patients",validateToken, isAdmin,getPatientInfos);

router.post("/register-patient", validateToken, isAdmin,createPatientInfo);

router.get("/get-single-patient/:_id",validateToken, isAdmin, getPatientInfo);

router.post("/add-health-record",validateToken, isAdmin, addPatientHealthRecord);

router.put("/:id",updtePatientInfo);

router.delete("/:id",deletePatientInfo);

module.exports = router;