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

const secretcryptokey = "thronus@#_Secret_KEY";
var ciphertext = CryptoJS.AES.encrypt("123456", secretcryptokey).toString();
// console.log("🚀 ~ file: controllers.js:15 ~ ciphertext:", ciphertext);

module.exports = {
  chatPage: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      const title = "Chat";

      res.render("subadmin/chat/chat", {
        layout: "layout/chatLayout",
        title,
      });
    } catch (error) {
      console.log(error);
    }
  },
  patientChat: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      const title = "Patients List";
      
      let patientId = req.params.id;
      let patientData = await users.findOne({
        _id : req.params.id,
        // role: 2,
      });

      res.render("subadmin/chat/patientChat", {
        layout: "layout/chatLayout",
        title,
        patientId,
        patientData
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: chatControllers.js:29 ~ chatPage:async ~ error:",
        error
      );
    }
  },
  adminChat: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      const title = "adminChat";

      let get_admin_details = await users.findOne({
        role : 0
      });

      res.render("subadmin/chat/adminchat",{layout: "layout/chatLayout",title,get_admin_details});
    } catch (error) {
      console.log(error);
    }
  },
  userchat: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      var title = "Patients List";

      let get_user_details = await users.findOne({
        _id : req.params.id
      });
      if(get_user_details.role == 3){
        title = "doctorsList";
      }
      
      res.render("subadmin/chat/userchat",{layout: "layout/chatLayout",title,get_user_details,helper});
    } catch (error) {
      console.log(error);
    }
  },
};
