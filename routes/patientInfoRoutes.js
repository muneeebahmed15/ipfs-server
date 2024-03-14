const express = require("express");
const router = express.Router();

const {getPatientInfos, createPatientInfo,
getPatientInfo, updtePatientInfo, deletePatientInfo,
getPatientByName, addPatientHealthRecord, getPatientByCnic,
loginPatient,
currentUser, 
loadUser,
updatePassword,
GetHealthRecord,
searchPatients,
getAllHealthRecord} = require("../controllers/patientInfoController");

 const {validateToken, isAdmin, isDoctor, isPatient} = require("../middleware/validateTokenHandler");


//routes for patient
router.post ("/login", loginPatient);
router.get("/current", validateToken,isPatient, currentUser);

//routes for admin
router.post("/register-patient", validateToken, isAdmin,createPatientInfo);

router.get("/get-health-record/:_id",validateToken, isAdmin, GetHealthRecord);

router.post("/add-health-record",validateToken, isAdmin, addPatientHealthRecord);

//routes for admin & doctor
router.get("/get-all-patients",validateToken, getPatientInfos);

router.get("/get-single-patient/:_id",validateToken, getPatientInfo);

router.get("/get-patient-by-cnic/:cnic",validateToken,  getPatientByCnic);

router.get("/get-patient-by-name/:name",validateToken,  getPatientByName);

router.get("/load-user/:_id",validateToken, loadUser);

router.put("/update-password",validateToken, updatePassword);

router.get("/get-all-health-record", validateToken, getAllHealthRecord);



router.put("/:id",updtePatientInfo);

router.delete("/:id",deletePatientInfo);

module.exports = router;