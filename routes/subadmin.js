var express = require("express");
var router = express.Router();
let subadmin = require("../controllers/subadmin/controllers");
const authenticateRoute = require("../helper/nextHelpers").authenticateRoute;
const products = require("../controllers/subadmin/productsControllers");
const patients = require("../controllers/subadmin/patientsController");
const chat = require("../controllers/subadmin/chatControllers");
const prescription = require("../controllers/subadmin/prescriptionController");


router.get("/login", subadmin.login);
router.post("/login", subadmin.loginPost);
router.get("/logout", subadmin.logout);
router.get("/dashboard", subadmin.dashboard);
router.get("/profile", subadmin.profilePage);
router.get("/profileUpdate", subadmin.profileUpdate);
router.post("/updateProfile", subadmin.updateProfile);

router.get("/changePassword", subadmin.changePass);
router.post("/checkpass", subadmin.checkpass);
router.post("/changePassword", subadmin.changePassUpdate);

router.get("/products", products.products);
router.get("/getProduct/:id", products.getProduct);
router.get("/addProduct", products.addProduct);
router.post("/addProduct", products.postProduct);
router.get("/editProduct/:id", products.getUpdateProduct);
router.post("/editProduct", products.updateProduct);
router.post("/productStatus", products.productStatus);
router.post("/deleteProduct", products.deleteProduct);

router.get("/patientsList", patients.patientsList);
router.get("/doctorsList", patients.doctorsList);
router.get("/viewDoctor/:id", patients.viewDoctor);
router.post("/deletePrescription", patients.deletePrescription);
router.get("/patient/:id", patients.getPatient);
router.get("/addPrescription/:id", patients.addPrescription);
router.post("/addPrescription", patients.addPostPrescription);
router.get("/editPrescription/:id", patients.editPrescription);
router.post("/editPrescription", patients.editPostPrescription);
// router.get("/blocked", patients.blocked);
router.post("/uploadInvoice",patients.uploadInvoice);


router.get("/chat", chat.chatPage);
router.get("/adminChat",chat.adminChat);
router.get("/userchat/:id",chat.userchat);


router.get("/patientChat/:id",chat.patientChat);


router.get("/prescription/:type",prescription.prescription);
router.get("/prescriptionView/:id",prescription.prescriptionView);

module.exports = router;
