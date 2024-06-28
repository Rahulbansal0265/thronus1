const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
// var aes256 = require("aes256");
var CryptoJS = require("crypto-js");
const moment = require("moment");
const users = require("../models/users");
const news = require("../models/news");
const prescription = require("../models/prescriptions");
const doctor_prescription = require("../models/doctor_precription");
const categories = require("../models/categories");
const products = require("../models/products");
const invoice = require("../models/invoice");
const cms = require("../models/cms");
const fileUpload = require("express-fileupload");
const docotors_list = require("../models/docotors_list");
const env = require("dotenv").config();
const secretcryptokey = "thronus@#_Secret_KEY";
var ciphertext = CryptoJS.AES.encrypt("123456", secretcryptokey).toString();
const doctor_list = require("../models/docotors_list");
const csv = require("csv-parser");
const path = require("path");
var fs = require("fs");


module.exports = {
  login: async (req, res) => {
    try {
      if (req.session.user) {
        res.redirect("/admin/dashboard");
      }
      res.render("dashboard/auth/login", {
        layout: false,
      });
    } catch (error) {
      helper.error(res, error);
    }
  },
  loginPost: async (req, res) => {
    try {
      const email = req.body.email;
      const passwrd = req.body.password;
      const checkEmail = await users.findOne({
        email: email,
        role: "0",
      });
      
      if (checkEmail) {
        var passwordBytes = CryptoJS.AES.decrypt(
          checkEmail.password,
          secretcryptokey
        );
        var originalText = passwordBytes.toString(CryptoJS.enc.Utf8);
        if (originalText == passwrd) {
          // req.session = req.session;
          req.session.user = checkEmail;
          return res.json(1);
        } else {
          req.flash("msg", "Please Enter Valid Details");
          return res.json(" Invalid Credentails");
          // res.redirect("/admin/login");
        }
      } else {
        req.flash("msg", "Please Enter Valid Details");
        return res.json("Email not match");
      }
    } catch (err) {
      console.log(err);
    }
  },
  logout: async (req, res) => {
    try {
      req.session.destroy((err) => {});
      res.redirect("/admin/login");
    } catch (error) {
      helper.error(res, error);
    }
  },
  dashboard: async (req, res) => {
    // var abc = "active";
    // console.log(req.session.user);
    const title = "dashboard";
    if (!req.session.user) return res.redirect("/admin/login");
    const patient = await users.countDocuments({ role: "2" });
    const doctor = await users.countDocuments({ role: "3" });
    const subAdmin = await users.countDocuments({ role: "1" });
    const category = await categories.countDocuments();
    const product = await products.countDocuments();
    const newsData = await news.countDocuments();
    const patient_prescription = await prescription.countDocuments();
    const doctors_prescription = await doctor_prescription.countDocuments();
    const prescriptionCount = patient_prescription+doctors_prescription;
    const invoices = await invoice.countDocuments();

    // console.log("users =====", patient_prescription+doctors_prescription);
    res.render("dashboard/auth/dashboard", {
      title,
      extractScripts: true,
      patient,
      doctor,
      subAdmin,
      category,
      product,
      newsData,
      prescriptionCount,
      invoices
    });
  },
  profilePage: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const admindata = await users.findOne({
        id: req.session.user.id,
      });
      let title = "profilePage";
      res.render("dashboard/auth/profilePage", { admindata, moment, title,msg:req.flash("msg")});
    } catch (error) {
      helper.error(res, error);
    }
  },
  profileUpdate: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const admindata = await users.findOne({
        _id: req.session.user.id,
      });
      let title = "profileUpdate";
      res.render("dashboard/auth/profileUpdate", { admindata, moment, title });
    } catch (error) {
      helper.error(res, error);
    }
  },
  updateProfile: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const v = new Validator(req.body, {
        firstName: "required",
        lastName: "required",
        email: "required",
        id: "required",
        // mobile: "required",
      });
      const values = JSON.parse(JSON.stringify(v));
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }
      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          values.inputs.image = helper.fileUpload(image, "profile");
        }
      }
      const updatedata = await users.findByIdAndUpdate(
        {
          _id: values.inputs.id,
        },
        values.inputs
      );
      const addsession = await users.findOne({
        email: req.session.user.email,
      });
      req.session.user = addsession;
      req.flash("msg", "Updated successfully");
      res.redirect("/admin/profile");
    } catch (error) {
      helper.error(res, error);
    }
  },
  changePass: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      let title = "changePass";
      res.render("dashboard/auth/changePass", { title,msg:req.flash("msg")});
    } catch (error) {
      helper.error(res, error);
    }
  },
  changePassUpdate: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        curruntPass: "required",
        newPass: "required",
        confirmNewPass: "required|same:newPass",
      });
      const values = JSON.parse(JSON.stringify(v));
      let errorsResponse = await helper.checkValidation(v);
      if (errorsResponse) {
        return helper.failed(res, errorsResponse);
      }
      const findPass = await users.findOne({
        id: req.session.user.id,
      });
      if (findPass) {
        var passwordBytes = CryptoJS.AES.decrypt(
          findPass.password,
          secretcryptokey
        );
        var originalText = passwordBytes.toString(CryptoJS.enc.Utf8);
        // const data = await bcrypt.compare(passwrd, findPass.password);
        if (originalText == values.inputs.curruntPass) {
          var cipherPass = CryptoJS.AES.encrypt(
            values.inputs.confirmNewPass,
            secretcryptokey
          ).toString();
          const signdata = await users.findByIdAndUpdate(
            { _id: req.session.user._id, type: 0 },
            {
              password: cipherPass,
            }
          );
          req.flash("msg", "Password Changed successfully");
          res.redirect("/admin/profile");
        } else {
          req.flash("msg", "Password Not Matched!");
          // console.log("password Not Matched");
          res.redirect("/admin/changePassword");
        }
      }
    } catch (error) {
      helper.error(res, error);
    }
  },
  // updateUserPost: async (req, res) => {
  //   try {
  //     const updateData = {
  //       name: req.body.name,
  //       email: req.body.email,
  //       gender: req.body.gender,
  //       birth_date: req.body.dob,
  //       address: req.body.address,
  //       mobile: req.body.mobile,
  //     };
  //     if (req.files && req.files.image) {
  //       var image = req.files.image;
  //       if (image) {
  //         updateData.image = helper.fileUpload(image, "userImg");
  //       }
  //     }
  //     const data = await db.users.update(updateData, {
  //       where: { id: req.body.id },
  //       type: "1",
  //     });
  //     if (data) {
  //     }
  //     res.redirect("/admin/userlist");
  //   } catch (error) {
  //     helper.error(res, error);
  //   }
  // },
  // updateUser: async (req, res) => {
  //   try {
  //     const userData = await db.users.findOne({
  //       where: { id: req.params.id },
  //     });
  //     res.render("dashboard/usersTable/updateUser", { userData });
  //   } catch (error) {
  //     helper.error(res, error);
  //   }
  // },
  // userStatus: async (req, res) => {
  //   try {
  //     let update = await db.users.update(
  //       {
  //         status: req.body.status,
  //       },
  //       {
  //         where: {
  //           id: req.body.id,
  //         },
  //       }
  //     );
  //     if (update) {
  //       res.json(1);
  //     } else {
  //       res.json(0);
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  // deleteuser: async (req, res) => {
  //   const deldata = await db.users.destroy({
  //     where: { id: req.params.id },
  //   });
  //   res.redirect("/admin/userlist");
  // },
  termsAndConditions: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const content = await cms.findOne({
        type: 1,
      });
      let title = "termsAndConditions";
      let titleMain = "cms";
      res.render("dashboard/page/termsAndConditions", {content,title,titleMain,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
  termsAndConditionsUpdate: async (req, res) => {
    if (!req.session.user) return res.redirect("/admin/login");
    await cms.findOneAndUpdate(
      {
        type: 1,
      },
      { content: req.body.content, title: req.body.title }
    );
    req.flash("msg", "Updated successfully");
    res.redirect("/admin/termsAndConditions");
  },
  privacyPolicy: async (req, res) => {
    try {
      const content = await cms.findOne({
        type: 2,
      });
      if (!req.session.user) return res.redirect("/admin/login");
      let title = "privacyPolicy";
      let titleMain = "cms";
      res.render("dashboard/page/privacyPolicy", {content,title, titleMain,msg:req.flash("msg")});
    } catch (error) {
      console.log(">>>>>>>>>>>>>", error);
    }
  },
  privacyPolicyUpdate: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const result = await cms.findOneAndUpdate(
        {
          type: 2,
        },
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
          },
        }
      );
      const content = await cms.findOne({
        type: 2,
      });
      req.flash("msg","Updated successfully");
      res.redirect("/admin/privacyPolicy");
    } catch (error) {
      console.log(error);
    }
  },
  aboutUs: async (req, res) => {
    try {
      const content = await cms.findOne({
        type: 3,
      });
      if (!req.session.user) return res.redirect("/admin/login");
      let title = "aboutUs";
      let titleMain = "cms";
      res.render("dashboard/page/aboutUs", {content,title,titleMain,msg:req.flash("msg")});
    } catch (error) {
      console.log(">>>>>>>>>", error);
    }
  },
  aboutUsUpdate: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      await cms.findOneAndUpdate(
        {
          type: 3,
        },
        { content: req.body.content, title: req.body.title }
      );
      req.flash("msg", "Updated successfully");
      res.redirect("/admin/aboutUs");
    } catch (error) {
      console.log(">>>>>>>>>>", error);
    }
  },
  // verificationPatient: async (req, res) => {
  //   try {
  //     const data = await db.users.update(
  //       {
  //         isVerify: req.body.value,
  //       },
  //       { where: { id: req.body.id } }
  //     );
  //     if (data) {
  //       res.json(1);
  //     }
  //   } catch (error) {}
  // },
  // test: async (req, res) => {
  //   try {
  //     const bookingInfo = await db.bookings.findOne({
  //       where: { id: 3 },
  //       include: [
  //         {
  //           model: db.users,
  //           as: "doctor_detail",
  //         },
  //         {
  //           model: db.users,
  //           as: "patient_detail",
  //         },
  //       ],
  //     });
  //     res.render("dashboard/test", { bookingInfo });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  // emailExist: async (req, res) => {
  //   try {
  //     console.log(req.body);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  checkpass: async (req, res) => {
    try {
      const checkPassword = await users.findOne({
        _id: req.session.user._id,
      });
      if (checkPassword) {
        var passwordBytes = CryptoJS.AES.decrypt(
          checkPassword.password,
          secretcryptokey
        );
        var originalText = passwordBytes.toString(CryptoJS.enc.Utf8);
        if (originalText == req.body.curruntPass) {
          return res.json(true);
        } else {
          return res.json(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  upload_csv: async (req, res) => {
    try {
      var FILE_TYPE = "csv";
      const results = [];
      var image_data = [];
      if (req.files && req.files.csvfile && req.files.csvfile.name != "") {
        var image_url = "";
        var image_url = await helper.fileUpload(req.files.csvfile, "images");
        image_data.push(image_url);
        if (image_url != "") {
          let eventCsvPath = path.join(__dirname, "../public", image_url);
          if (eventCsvPath) {
            fs.createReadStream(eventCsvPath)
              .pipe(csv())
              .on("data", (data) => {
                return results.push(data);
              })
              .on("end", async () => {
                for (let i = 0; i < results.length; i++) {
                  const item = results[i];
                  // console.log("🚀 ~ file: adminControllers.js:450 ~ .on ~ item:", item)
                  let findemail = await doctor_list.findOne({
                    email: item.email,
                  });
                  if (!findemail) {
                    let obj = {
                      firstName: item.firstName,
                      lastName:item.lastName,
                      email: item.email,
                      phoneNumber: item.phoneNumber,
                    };
                    let data = await doctor_list.create(obj);
                    // console.log("🚀 ~ file: adminControllers.js:461 ~ .on ~ data:", data)
                  }
                }
              });
            res.redirect("/admin/doctorsList");
          }
        }
      }
    } catch (error) {
      console.log(error, "111111111111111111111111111111111");
    }
  },
};
