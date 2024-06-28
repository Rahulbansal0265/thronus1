var express = require("express");
var router = express.Router();
const admin = require("../controllers/adminControllers");
const categories = require("../controllers/categoriesControllers");
const customerSupport = require("../controllers/customerSupport");
const users = require("../controllers/usersControllers");
const products = require("../controllers/productsControllers");
const news = require('../controllers/newsController');
const tools = require('../controllers/toolsController');
const message = require('../controllers/messageController');
const reward = require("../controllers/rewardController");
const prescription = require("../controllers/prescriptionController");
const report = require('../controllers/reportController');



router.get("/login", admin.login);
router.post("/login", admin.loginPost);
router.get("/logout", admin.logout);
router.get("/dashboard", admin.dashboard);
router.get("/profile", admin.profilePage);
router.get("/profileUpdate", admin.profileUpdate);
router.post("/updateProfile", admin.updateProfile);

router.get("/changePassword", admin.changePass);
router.post("/checkpass", admin.checkpass);
router.post("/changePassword", admin.changePassUpdate);

router.get("/termsAndConditions", admin.termsAndConditions);
router.post("/termsAndConditions", admin.termsAndConditionsUpdate);

router.get("/privacyPolicy", admin.privacyPolicy);
router.post("/privacyPolicy", admin.privacyPolicyUpdate);

router.get("/aboutUs", admin.aboutUs);
router.post("/aboutUs", admin.aboutUsUpdate);
// ========================      users         ===================

router.get("/users", users.usersList);
router.get('/doctor_bulk_add',users.doctor_bulk_add);
router.get('/doctor_add',users.doctor_add);
router.post('/addDoctor',users.addDoctor);
router.get("/doctorsList", users.doctorsList);
// router.get("/get_data", users.get_data);
router.get("/editDoctor/:id", users.editDoctor);
router.post("/updateDoctor", users.updateDoctor);
router.get("/addUser", users.UserCreate);
router.get("/subAdminList", users.getAllDoctor);
router.get("/deleteUser/:id", users.deleteUser);
router.post("/addUser", users.addUser);
router.post("/updateUser", users.updateUser);
router.post("/status", users.status);
router.get("/editUser/:id", users.editUser);
router.get("/viewUser/:id", users.viewUser);
router.get("/subAdminView/:id", users.subAdminView);
router.post("/get/users", users.assignUsers);
router.get("/search/users", users.typeAheadSearch);
router.get("/blockedList", users.blockedList);
router.post("/blockedStatus", users.blockedStatus);
router.get("/blockedDelete/:id", users.blockedDelete);
router.post("/uploadInvoice", users.uploadInvoice);
router.get("/invoice",users.invoice);
router.get("/invoiceView/:id", users.invoiceView);
router.post("/assignSubAdminDoctor",users.assignSubAdminDoctor);



// ========================      users         ===================
// ========================      categories         ===================
router.get("/categories", categories.categories);
router.get("/addCategory", categories.addCategory);
router.post("/addCategory", categories.postCategory);
router.get("/editCategory/:id", categories.getUpdateCategory);
router.post("/editCategory", categories.updateCategory);
router.post("/categoryStatus", categories.categoryStatus);
router.post("/deleteCategory", categories.deleteCategory);
router.get("/products", products.products);
router.get("/addProduct", products.addProduct);
router.post("/addProduct", products.postProduct);
router.get("/editProduct/:id", products.getUpdateProduct);
router.get("/getProduct/:id", products.getProduct);
router.post("/editProduct", products.updateProduct);
router.post("/productStatus", products.productStatus);
router.post("/deleteProduct", products.deleteProduct);
router.post("/deleteProductImg",products.deleteProductImg);

// ========================      categories         ===================
router.get("/support/list", customerSupport.list);
router.post("/deleteSupport", customerSupport.deleteSupport);
router.get("/viewSupport/:id", customerSupport.viewSupport);
router.post("/sendSupport", customerSupport.sendSupport);
router.post("/support_status", customerSupport.support_status);
router.post("/upload_csv", admin.upload_csv);

// ========================      news         ===================
router.get("/news",news.newsList);
router.get("/addNews",news.getFormNews);
router.post("/addNews",news.addNews);
router.post("/newsstatus", news.status);
router.get("/newsView/:id",news.newsViews);
router.get("/newsEdit/:id",news.newsEdit);
router.post("/updateNews",news.updateNews);
router.post("/deleteNews", news.deleteNews);


// ========================      Tools         ===================
router.get("/PatientBooklet",tools.getPatientBooklet);
router.post("/PatientBooklet",tools.savePatientBooklet);
router.get("/monography",tools.monography);
router.post("/monography",tools.saveMonography);
router.get("/education",tools.education);
router.post("/education",tools.saveEducation);
router.get("/productPortfolio",tools.productPortfolio);
router.post("/productPortfolio",tools.saveproductPortfolio);
router.get("/faq",tools.faq);
router.get("/addFaq",tools.addFaq);
router.post("/saveFaq",tools.saveFaq);
router.get("/viewFaq/:id",tools.viewFaq);
router.get("/editFaq/:id",tools.editFaq);
router.post("/updateFaq",tools.updateFaq);
router.post("/deleteFaq", tools.deleteFaq);



// ========================      message         ===================
router.get("/message",message.message);
router.get("/chat/:id",message.chat);


// ========================      rewards         ===================
router.get("/reward",reward.rewardList);
router.get("/getFormReward",reward.getFormReward);
router.post("/addReward",reward.addReward);
router.get("/rewardView/:id",reward.rewardView);
router.get("/rewardEdit/:id",reward.rewardEdit);
router.post("/updateReward",reward.updateReward);
router.post("/deleteReward", reward.deleteReward);


// ========================      prescription         ===================
router.get("/prescription/:type",prescription.prescription);
router.get("/prescriptionView/:id",prescription.prescriptionView);
router.post("/assignSubAdmin",prescription.assignSubAdmin);
router.get("/doctorprescription",prescription.doctorprescription);
router.post("/assignSubAdmin/doctor",prescription.assignSubAdminDoctor);
router.get("/prescriptionViewDoctor/:id",prescription.prescriptionViewDoctor);
router.post("/changePrescriptionStatus",prescription.changePrescriptionStatus);




// ========================      report        ===================
router.get("/report",report.report);
router.get("/reportView/:id",report.reportView);








// router.get("/test",prescription.test)

module.exports = router;
