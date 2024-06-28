const helper = require("../helper/helper");

const constant = require("../models/constant");
const users = require("../models/users");

module.exports = {

  message: async (req, res) => {
    try {
      const title = "message";
      if (!req.session.user) return res.redirect("/admin/login");
      const result = await constant.find({

      }).populate("lastMessageId").populate("receiverId")
      // .populate("message");
      console.log(result,">>>>>>>>>>>");
      res.render("dashboard/message/list", {layout: "layout/chatLayoutAdmin", result, title });
    } catch (error) {
      console.log(error);
    }
  },
  chat: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const title = "Doctors List";
      let subadminId = req.params.id
      const subAdminData = await users.findOne({
        _id: subadminId
      });
     
      res.render("dashboard/message/subAdminChat", { 
        layout: "layout/chatLayoutAdmin", 
        subAdminData, title, subadminId });
    } catch (error) {
      console.log(error);
    }
  },

};
