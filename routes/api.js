const express = require("express");
const router = express.Router();
const {authenticateHeader,authenticateJWT} = require("../helper/nextHelpers");
const authController = require("../controllers/api/authController");
const toolsController = require("../controllers/api/toolsController");
const homeController = require("../controllers/api/homeController");
const rewardController = require("../controllers/api/rewardController");
const categoryController = require("../controllers/api/categoryController");
const userController = require("../controllers/api/userController");
const prescriptionController = require("../controllers/api/prescriptionController");
const notificationController = require("../controllers/api/notificationController");


router.get('/resetPassword/:id/:ran_token',authController.resetPassword);
router.post('/updateForgotPassword',authController.updateResetPassword);


router.use(authenticateHeader);

router.post("/signup",authController.signUp);
router.post("/login",authController.login);
router.get("/getProfile",[authenticateJWT],authController.getProfile);
router.post("/otpVerify",[authenticateJWT],authController.otpVerify);
router.get("/resendOtp",[authenticateJWT],authController.resendOtp);
router.post("/chatStatus",[authenticateJWT],authController.chatStatus);
router.post("/editProfile",[authenticateJWT],authController.editProfile);
router.post("/changePassword",[authenticateJWT],authController.changePassword);
router.post("/forgotPassword",authController.forgotPassword);
router.get("/logout",[authenticateJWT],authController.logout);
router.post("/imageUpload",authController.imageUpload);
router.post("/notificationStatus",[authenticateJWT],authController.notificationStatus);
router.post("/emailNotificationStatus",[authenticateJWT],authController.emailNotificationStatus);
router.get("/getStaffId",[authenticateJWT],authController.getStaffId);


router.get("/cms/:type",toolsController.cms);
router.get("/tools/:type",toolsController.tools);
router.post("/customerSupport",[authenticateJWT],toolsController.customerSupport);
router.get("/productList",[authenticateJWT],toolsController.productList);
router.post("/productDetails",[authenticateJWT],toolsController.productDetails);
router.get("/questionsList",[authenticateJWT],toolsController.questionsList);
router.post("/questionDetails",[authenticateJWT],toolsController.questionDetails);
router.post("/answer",[authenticateJWT],toolsController.answer);
router.post("/report",[authenticateJWT],toolsController.report);
router.post("/blockUnblock",[authenticateJWT],toolsController.blockUnblock);
router.get("/blockList",[authenticateJWT],toolsController.blockList);


router.get("/homePage/:type",[authenticateJWT],homeController.homePage);
router.post("/newsDetails",[authenticateJWT],homeController.newsDetails);
// router.get("/slaesforceData",[authenticateJWT],homeController.slaesforceData);
// router.get("/slaesforceData1",[authenticateJWT],homeController.slaesforceData1);
// router.get("/slaesforceDataDoctor",[authenticateJWT],homeController.slaesforceDataDoctor);


router.get("/getRewards",[authenticateJWT],rewardController.getRewards);
router.post("/rewardDetails",[authenticateJWT],rewardController.rewardDetails);


router.get("/getCategory",categoryController.getCategory);


router.get("/doctorList",[authenticateJWT],userController.doctorList);
router.post("/doctorDetails",[authenticateJWT],userController.doctorDetails);
router.post("/myDoctorList",[authenticateJWT],userController.myDoctorList);


router.post("/addpatientprescription",[authenticateJWT],prescriptionController.addpatientprescription);
router.post("/patientPrescriptionList",[authenticateJWT],prescriptionController.patientPrescriptionList);
router.post("/addDoctorPrescription",[authenticateJWT],prescriptionController.addDoctorPrescription);
router.post("/DoctorPrescriptionDetail",[authenticateJWT],prescriptionController.DoctorPrescriptionDetail);
router.post("/patientPrescriptionDetail",[authenticateJWT],prescriptionController.patientPrescriptionDetail);
router.post("/getInvoice",[authenticateJWT],prescriptionController.getInvoice);
router.post("/invoiceDetails",[authenticateJWT],prescriptionController.invoiceDetails);



router.get("/notificationListing",[authenticateJWT],notificationController.notificationListing);


module.exports = router;


