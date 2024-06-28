const helper = require("../../helper/helper");
const { Validator } = require("node-input-validator");
// var aes256 = require("aes256");
const { default: mongoose } = require("mongoose");

var CryptoJS = require("crypto-js");
const moment = require("moment");
const users = require("../../models/users");
const categories = require("../../models/categories");
const products = require("../../models/products");
const cms = require("../../models/cms");
const fileUpload = require("express-fileupload");
const env = require("dotenv").config();
const prescriptions = require("../../models/prescriptions");
const blocked = require("../../models/blockSchema");
const doctor_prescription = require("../../models/doctor_precription");

const secretcryptokey = "thronus@#_Secret_KEY";
var ciphertext = CryptoJS.AES.encrypt("123456", secretcryptokey).toString();

module.exports = {
  login: async (req, res) => {
    try {
      if (req.session.user) {
        res.redirect("/subadmin/dashboard");
      }
      res.render("subadmin/auth/login", {
        layout: false,
      });
    } catch (error) {
      console.log("🚀 ~ file: controllers.js:26 ~ login: ~ error:", error);
      //   helper.error(res, error);
    }
  },
  loginPost: async (req, res) => {
    try {
      const email = req.body.email;
      const passwrd = req.body.password;

      const checkEmail = await users.findOne({
        email: email,
        role: "1",
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
          return res.json(" Invalid Credentails");
          // req.flash("msg", "Please Enter Valid Details");
          // res.redirect("/doctor/login");
        }
      } else {
        return res.json("Email not match");
      }
    } catch (err) {
      console.log(err);
    }
  },
  logout: async (req, res) => {
    try {
      req.session.destroy((err) => { });
      res.redirect("/subadmin/login");
    } catch (error) {
      helper.error(res, error);
    }
  },
  dashboard: async (req, res) => {
    // var abc = "active";
    // console.log(req.session.user);
    const title = "dashboard";
    if (!req.session.user) return res.redirect("/subadmin/login");
    const product = await products.countDocuments();
    const patientsList = await users.countDocuments({
      role: 2,
      AssignedSubAdminId: req.session.user._id,
    });
    const doctorList = await users.countDocuments({
      role: 3,
      AssignedSubAdminId: req.session.user._id,
    });
    let get_all_users = await users.find({
      AssignedSubAdminId: req.session.user._id
    });

    var userEmails = get_all_users.map(user => user.email);
    var userIds = get_all_users.map(user => user._id);
    let doctors_prescription = await doctor_prescription.countDocuments({
      email: { $in: userEmails }
    });
    let patient_prescription = await prescriptions.countDocuments({
      patientId: { $in: userIds }
    });

    const prescriptionCount = patient_prescription + doctors_prescription;
    res.render("subadmin/auth/dashboard", {
      layout: "layout/layout2",
      title,
      patientsList,
      doctorList,
      product,
      prescriptionCount,
    });
  },
  profilePage: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      const admindata = await users.findOne({
        _id: req.session.user._id,
      });
      let title = "profilePage";

      res.render("subadmin/auth/profilePage", {
        admindata,
        moment,
        title,
        layout: "layout/layout2",
        msg: req.flash("msg")
      });
    } catch (error) {
      helper.error(res, error);
    }
  },
  profileUpdate: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      const admindata = await users.findOne({
        _id: req.session.user._id,
      });
      let title = "profileUpdate";

      res.render("subadmin/auth/profileUpdate", {
        admindata,
        moment,
        title,
        layout: "layout/layout2",
      });
    } catch (error) {
      helper.error(res, error);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const v = new Validator(req.body, {
        firstName: "required",
        lastName: "required",
        id: "required",
        email: "required",

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
      req.flash("msg", "Profile Updated successfully");
      res.redirect("/subadmin/profile");
    } catch (error) {
      helper.error(res, error);
    }
  },
  changePass: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      let title = "changePass";
      res.render("subadmin/auth/changePass", {
        title,
        layout: "layout/layout2",
        msg: req.flash("msg")
      });
    } catch (error) {
      helper.error(res, error);
    }
  },

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
  changePassUpdate: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
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
          res.redirect("/subadmin/profile");
        } else {
          req.flash("msg", "Password Not Matched!");
          // console.log("password Not Matched");
          res.redirect("/subadmin/changePassword");
        }
      }
      // // console.log(req.body,">>>>>>>>>>>>>>>req");
      // // return
      // const v = new Validator(req.body, {
      //   curruntPass: "required",
      //   newPass: "required",
      //   confirmNewPass: "required|same:newPass",
      // });
      // const values = JSON.parse(JSON.stringify(v));
      // let errorsResponse = await helper.checkValidation(v);
      // if (errorsResponse) {
      //   return helper.failed(res, errorsResponse);
      // }
      // const findPass = await users.findOne({
      //   _id: req.session.user._id,
      // });
      // if (findPass) {
      //   var passwordBytes = CryptoJS.AES.decrypt(findPass.password,secretcryptokey);
      //   var originalText = passwordBytes.toString(CryptoJS.enc.Utf8);
      //   // const data = await bcrypt.compare(passwrd, findPass.password);
      //   if (originalText == values.inputs.curruntPass) {
      //     var cipherPass = CryptoJS.AES.encrypt(
      //       values.inputs.confirmNewPass,
      //       secretcryptokey
      //     ).toString();
      //     const signdata = await users.findByIdAndUpdate(
      //       { _id: req.session.user._id, type: 0 },
      //       {
      //         password: cipherPass,
      //       }
      //     );
      //     req.flash("msg", "Password Changed successfully");
      //     res.redirect("/subadmin/profile");
      //   } else {
      //     req.flash("msg", "Password Not Matched!");
      //     // console.log("password Not Matched ");
      //     res.redirect("/subadmin/changePass");
      //   }
      // }
    } catch (error) {
      helper.error(res, error);
    }
  },
};
