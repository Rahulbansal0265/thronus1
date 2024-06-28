const helper = require("../../helper/helper");
const { Validator } = require("node-input-validator");
// var aes256 = require("aes256");
var CryptoJS = require("crypto-js");
const moment = require("moment");
const users = require("../../models/users");
const invoices = require("../../models/invoice");
const blocked = require("../../models/blockSchema");
const notification = require("../../models/notification");
const prescriptions = require("../../models/prescriptions");
const doctor_prescription=require('../../models/doctor_precription')
const fileUpload = require("express-fileupload");
const { default: mongoose } = require("mongoose");
const env = require("dotenv").config();

module.exports = {
  patientsList: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      var mysort = { createdAt: -1 };
      
      const patientsList = await users.find({
         role: 2 ,
         AssignedSubAdminId: req.session.user._id,
        })
        .sort({ createdAt: "desc" });

      let title = "Patients List";
      let type = "doctor";
      res.render("subadmin/users/list", {
        title,
        type,
        patientsList,
        layout: "layout/layout2",
      });
    } catch (error) {
    }
  },
  deletePrescription: async (req, res) => {
    try {
      // console.log(req.body);
      const update = await prescriptions.deleteOne({ _id: req.body.id });
      if (update) {
        res.json(1);
      } else {
        res.json(0);
      }

      //   res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
    }
  },
  doctorsList: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      
      const result = await users.find({
         role: 3,
         AssignedSubAdminId: req.session.user._id,
        })
        .sort({ createdAt: "desc" });

      let title = "doctorsList";
      res.render("subadmin/users/doctorList", {title,result,layout: "layout/layout2",});

    } catch (error) {
      console.log(error);
    }
  },
  viewDoctor: async(req,res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      let title = "doctorsList";
      user = await users.findById({ _id: req.params.id }).populate("categoryId");
      var user = await users.aggregate([
        {
          $match: { 
            _id: mongoose.Types.ObjectId(req.params.id) // Convert string to ObjectId
          }
        },
        {
          $lookup: {
            from: 'doctor_prescriptions',
            localField: '_id', // Field in User model
            foreignField: 'doctorId',
            as: 'doctorPrescription',
            
          },
        },
      ]);

      var categoryName = await users.findById({ _id: req.params.id }).populate("categoryId");

      res.render("subadmin/users/viewDoctor", {user, title ,categoryName,layout: "layout/layout2",});
      
    } catch (error) {
      console.log(error);
    }
  },
  // blocked: async (req, res) => {
  //   try {
  //     if (!req.session.user) return res.redirect("/subadmin/login");
  //     let title = "blocked";
  //     const user = await blocked
  //       .find({ blockedBy: req.session.user._id })
  //       .sort({ createdAt: -1 })
  //       .populate("blockedBy")
  //       .populate("blockedTo");

  //     res.render("subadmin/users/blockedList", {
  //       user,
  //       title,
  //       layout: "layout/layout2",
  //     });
  //   } catch (error) {
  //   }
  // },
  getPatient: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      let title = "Patients List";

      // var patient_data = await users.aggregate([
      //   {
      //     $match: { 
      //       _id: mongoose.Types.ObjectId(req.params.id) // Convert string to ObjectId
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: 'prescriptions',
      //       localField: '_id', // Field in User model
      //       foreignField: 'patientId',
      //       as: 'patientPrescription',
      //       pipeline:[
      //         {
      //           $lookup: {
      //             from: 'users', // Assuming the collection name for doctors is 'doctor'
      //             localField: 'doctorId', // Field in the Prescription model
      //             foreignField: '_id', // Field in the Doctor model
      //             as: 'doctorDetails',
      //             pipeline:[
      //               {
      //                 $project:{
      //                   firstName:1,
      //                   lastName:1
      //                 }
      //               }
      //             ]
      //           },
      //         },
      //         {
      //           $unwind:{
      //             path:"$doctorDetails",
      //             preserveNullAndEmptyArrays:false
      //           }
      //         },
      //         {
      //           $addFields:{
      //             docterFName:"$doctorDetails.firstName",
      //             docterLName: "$doctorDetails.lastName"
      //           }
      //         },
      //         {
      //           $unset:"doctorDetails"
      //         },
      //       ]
      //     },
      //   },
      // ]).sort({ createdAt: "desc" });
      let get_user = await users.findOne({
        _id : req.params.id
      });
      let get_all_invoice = await invoices.find({
        patientId : req.params.id,
      })
      .populate({
        path: 'patientId',
        model: 'users' ,
        select: '_id role firstName lastName email phoneNumber image'
      }).populate({
        path: 'uploadedBy',
        model: 'users' ,
        select: '_id role firstName lastName email phoneNumber image'
      }).sort({ createdAt: "desc" });

      let get_all_doctors = await prescriptions.find({
        patientId: req.params.id
    })
    .populate({
        path: "doctorId",
        select: "_id firstName lastName email role image chatStatus address categoryId",
        // populate: "categoryId"
    })
    .sort({ createdAt: "desc" })

    let get_all_doctors1 = await doctor_prescription.find({
        email: get_user.email
    })
    .populate({
        path: "doctorId",
        select: "_id firstName lastName email role image chatStatus address categoryId",
        populate: "categoryId"
    })
    .sort({ createdAt: "desc" })

    let mergedArray = [...get_all_doctors, ...get_all_doctors1];

    res.render("subadmin/users/view", {get_user,mergedArray,title ,get_all_invoice,layout: "layout/layout2",});
    } catch (error) {
      console.log(error);
    }
  },
  addPrescription: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      let title = "addPrescription";
      let type = "doctor";
      let patientId = req.params.id;
      let data;
      res.render("subadmin/users/addOrEdit", {
        title,
        type,
        patientId,
        layout: "layout/layout2",
      });
    } catch (error) {
      console.log(error);
    }
  },
  editPrescription: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      let title = "EditPrescription";
      let type = "doctor";
      let preId = req.params.id;

      const data = await prescriptions.findById({ _id: preId });

      res.render("subadmin/users/addOrEdit", {
        title,
        type,
        data,
        layout: "layout/layout2",
      });
    } catch (error) {
      console.log(error);
    }
  },
  addPostPrescription: async (req, res) => {
    try {
      let { title, note,name,phoneNumber,email,countryCode } = req.body;
      let imageArray = [];
      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          image = await helper.fileUploader(image, "products");
          imageArray.push(image);
        }
      }
    const data=  await doctor_prescription.create({
        title,
        // patientId,
        doctorId: req.body.id,
        note,
        file: imageArray,
        name,
        phoneNumber,
        email,countryCode
      });
      // res.redirect(`/doctor/patient/${patientId}`);
      helper.success(res,"successfully",data)
    } catch (error) {
      console.log(error);
    }
  },
  editPostPrescription: async (req, res) => {
    try {
      let { title, note, id, patientId } = req.body;

      let imageArray = [];
      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          image = await helper.fileUploader(image, "products");
          imageArray.push(image);
        }
      }
      await prescriptions.findByIdAndUpdate(
        { _id: id },
        {
          title,
          doctorId: req.session.user._id,
          note,
          file: imageArray,
        }
      );
      res.redirect(`/subadmin/patient/${patientId}`);
    } catch (error) {
      console.log(error);
    }
  },
  uploadInvoice: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      if (req.files && req.files.invoice) {
        var invoice_name = req.files.invoice;
        if (invoice_name) {
          invoice_name = helper.fileUpload(invoice_name, "invoice");
        }
      }
      let saveinvoice = await invoices.create({
        uploadedBy : req.session.user._id,
        patientId : req.body.userId,
        invoice : invoice_name,
      });
      let get_patient_details = await users.findOne({
        _id : req.body.userId
      });
      let all_data = {
        msg: `${req.session.user.firstName} send you invoice`,
        sender_id: req.session.user._id,
        device_token: get_patient_details?.deviceToken,
        sender_name: req.session.user.firstName,
        noti_type: 2,
        image: invoice_name,
      }

      await helper.sendFCMnotificationImage(all_data);

      await notification.create({
        title: 'Geracao Thronus', 
        senderId: req.session.user._id, 
        receiverId: req.body.userId,
        image : all_data.image,
        message : `You have recieved invoice from staff as per your presceription`,//`${req.session.user.firstName} send you invoice`,
        type: all_data.noti_type,
      });
      res.redirect(`/subadmin/patient/${req.body.userId}`);
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
