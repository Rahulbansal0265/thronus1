const helper = require("../helper/helper");

const tools = require("../models/tools");
const questions = require("../models/questions");
const mongoose = require("mongoose");


module.exports = {

  getPatientBooklet: async (req, res) => {
    try {
        const title = "Patient Booklet";
        if (!req.session.user) return res.redirect("/admin/login");
        const result = await tools.findOne({
          type: 1
        });
        res.render("dashboard/tools/PatientBooklet", {result,title,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
  savePatientBooklet: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const result = await tools.findOne({
        type: 1
      });
      if(result){
        const user = await tools.updateOne({
          type : req.body.type,
        },{
          title: req.body.title ? req.body.title : '',
          description: req.body.description,
        });
      }else{
        const user = await tools.create({
          title: req.body.title ? req.body.title : '',
          description: req.body.description,
          type : req.body.type,
        });
      }
      req.flash("msg", "Updated successfully");
      res.redirect("/admin/PatientBooklet");

    } catch (error) {
      console.log(error);
    }
  },
  monography: async (req, res) => {
    try {
        const title = "monography";
        if (!req.session.user) return res.redirect("/admin/login");
        const result = await tools.findOne({
          type: 2
        });
        res.render("dashboard/tools/monography", {result,title,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
  saveMonography: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const result = await tools.findOne({
        type: 2
      });
      if(result){
        const user = await tools.updateOne({
          type : req.body.type,
        },{
          title: req.body.title ? req.body.title : '',
          description: req.body.description,
        });
      }else{
        const user = await tools.create({
          title: req.body.title ? req.body.title : '',
          description: req.body.description,
          type : req.body.type,
        });
      }
      req.flash("msg", "Updated successfully");
      res.redirect("/admin/monography");

    } catch (error) {
      console.log(error);
    }
  },
  education: async (req, res) => {
    try {
        const title = "education";
        if (!req.session.user) return res.redirect("/admin/login");
        const result = await tools.findOne({
          type: 3
        });
        res.render("dashboard/tools/education", {result,title,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
  saveEducation: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const result = await tools.findOne({
        type: 3
      });
      if(result){
        const user = await tools.updateOne({
          type : req.body.type,
        },{
          title: req.body.title ? req.body.title : '',
          description: req.body.description,
        });
      }else{
        const user = await tools.create({
          title: req.body.title ? req.body.title : '',
          description: req.body.description,
          type : req.body.type,
        });
      }
      req.flash("msg", "Updated successfully");
      res.redirect("/admin/education");

    } catch (error) {
      console.log(error);
    }
  },
  productPortfolio: async (req, res) => {
    try {
        const title = "Product Portfolio";
        if (!req.session.user) return res.redirect("/admin/login");
        const result = await tools.findOne({
          type: 4
        });
        res.render("dashboard/tools/productPortfolio", {result,title,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
  saveproductPortfolio: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const result = await tools.findOne({
        type: 4
      });
      if(result){
        const user = await tools.updateOne({
          type : req.body.type,
        },{
          title: req.body.title ? req.body.title : '',
          description: req.body.description,
        });
      }else{
        const user = await tools.create({
          title: req.body.title ? req.body.title : '',
          description: req.body.description,
          type : req.body.type,
        });
      }
      req.flash("msg", "Updated successfully");
      res.redirect("/admin/productPortfolio");

    } catch (error) {
      console.log(error);
    }
  },
  faq: async (req, res) => {
    try {
        const title = "FAQ";
        if (!req.session.user) return res.redirect("/admin/login");
        const result = await questions.find({});
        res.render("dashboard/faq/listing", {result,title,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
  addFaq: async (req, res) => {
    try {
        const title = "FAQ";
        if (!req.session.user) return res.redirect("/admin/login");
        res.render("dashboard/faq/add", {title,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
  saveFaq: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      
        const user = await questions.create({
          question: req.body.question,
          // answer: req.body.answer,
        });
      
      req.flash("msg", "Added successfully");
      res.redirect("/admin/faq");

    } catch (error) {
      console.log(error);
    }
  },
  viewFaq: async (req, res) => {
    try {
        const title = "FAQ";
        if (!req.session.user) return res.redirect("/admin/login");
        // const data = await questions.findOne({
        //   _id : req.params.id
        // }).populate("questionId");
        const data = await questions.aggregate([
          {
            $match: { 
              _id: mongoose.Types.ObjectId(req.params.id)
            }
          },
          {
            $lookup: {
              from: 'answers',
              localField: '_id', // Field in question model
              foreignField: 'questionId',
              as: 'answerList',
              pipeline:[
                {
                  $lookup: {
                    from: 'users', // Assuming the collection name for user is 'users'
                    localField: 'userId', // Field in the answer model
                    foreignField: '_id', // Field in the user model
                    as: 'userDetails',
                  },
                },
                {
                  $unwind:{
                    path:"$userDetails",
                    preserveNullAndEmptyArrays:false
                  }
                },
              ]
            },
          },
        ])

        console.log(data[0].answerList[2],">>>>>>>>>>>>>data");
        // return
        
        res.render("dashboard/faq/view", {data,title,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
  editFaq: async (req, res) => {
    try {
        const title = "FAQ";
        if (!req.session.user) return res.redirect("/admin/login");
        const data = await questions.findOne({
          _id : req.params.id
        });
        
        res.render("dashboard/faq/edit", {data,title,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
  updateFaq: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      
        const user = await questions.findByIdAndUpdate({
          _id : req.body.id },{
          question: req.body.question,
          answer: req.body.answer,
        });
      
      req.flash("msg", "Updated successfully");
      res.redirect("/admin/faq");

    } catch (error) {
      console.log(error);
    }
  },
  deleteFaq: async (req, res) => {
    try {
      const update = await questions.deleteOne({ _id: req.body.id });

      if (update) {
        // console.log("ok", "//////////////////////////////////////");
        res.json(1);
      } else {
        // console.log("okfdssa", "//////////////////////////////////////");
        res.json(0);
      }

      //   res.redirect("/admin/categories");
    } catch (error) {
      console.log(error);
    }
  },
};
