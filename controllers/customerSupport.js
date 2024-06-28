const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
// var aes256 = require("aes256");
var CryptoJS = require("crypto-js");
const moment = require("moment");
const users = require("../models/users");
const support = require("../models/Support");
const fileUpload = require("express-fileupload");
const env = require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = {
  list: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");

      const title = "Customer Support";
      const list = await support.find().sort({ createdAt: -1 });

      res.render("dashboard/support/list", {
        title,
        list,
        extractScripts: true,
      });
    } catch (error) {
      console.log("🚀 ~ file: customerSupport.js:16 ~ list: ~ error:", error);
    }
  },
  deleteSupport: async (req, res) => {
    try {
      console.log(req.body);
      const update = await support.deleteOne({ _id: req.body.id });

      if (update) {
        res.json(1);
      } else {
        res.json(0);
      }

      //   res.redirect("/admin/categories");
    } catch (error) {
      console.log(error);
    }
  },
  viewSupport: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");

      const update = await support.findOne({ _id: req.params.id });

      let title = "viewSupport";
      res.render("dashboard/support/view", {
        title,
        update,
      });
      
    } catch (error) {
      console.log(error);
    }
  },
  sendSupport: async (req, res) => {
    try {
      var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "28182524df1f82",
          pass: "6a2bf03dbde623",
        },
      });
      let info = await transporter.sendMail({
        from: '" 👻" mailto:malkeet@example.com',
        to: req.body.email,
        subject: req.body.title,
        text: req.body.solution,
        html: "",
      });
      const data = await support.findByIdAndUpdate(
        { _id: req.body.id },
        {
          status: true,
        }
      );
      if (data) {
        return res.json(true);
      } else {
        return res.json(false);
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: customerSupport.js:64 ~ sendSupport:async ~ error:",
        error
      );
    }
  },
  support_status: async (req, res) => {
    try {
      // console.log(">>>>>>>>>>>>>>>>>>>>",req.body);
      var check = await support.findByIdAndUpdate(
        {
          _id: req.body._id,
        },
        {
          status: req.body.value,
        },
       
      );
      const data = await support.findOne({
        where: {
          id: req.body.id,
        },
        raw: true,
      });
      if (check) {
        req.flash("msg", "Event Status-Updated ");
        res.send(false);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
