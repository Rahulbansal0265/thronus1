
const prescription = require("../../models/prescriptions");
const doctor_prescription = require("../../models/doctor_precription");
const users = require("../../models/users");
const invoices = require("../../models/invoice");
const mongoose = require("mongoose");
const helper = require("../../helper/helper");
// const tes = require("../models/constant");

module.exports = {

  prescription: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      const title = "prescription";
      var result = [];
      let get_all_users = await users.find({
        AssignedSubAdminId : req.session.user._id
      });

      var userEmails = get_all_users.map(user => user.email);
      var userIds = get_all_users.map(user => user._id);
      // get both prescriptions
      if(req.params.type == 0){ 
        let result1 = await doctor_prescription.find({
          email: { $in: userEmails }
        }).populate({
          path: "doctorId",
          select: "_id firstName lastName email image",
        });

        let result2 = await prescription.find({
          patientId: { $in: userIds }
        }).populate({
          path: "patientId",
          select: "_id firstName lastName email image",
        })
        .populate({
          path: "doctorId",
          select: "_id firstName lastName email image",
        });
        result = [...result1, ...result2];

      }else if(req.params.type == 1){ // get doctor prescription 
        result = await doctor_prescription.find({
          email: { $in: userEmails }
        }).populate({
          path: "doctorId",
          select: "_id firstName lastName email image",
        });

      }else if(req.params.type == 2){ // get patient prescription 
        result = await prescription.find({
          patientId: { $in: userIds }
        }).populate({
          path: "patientId",
          select: "_id firstName lastName email image",
        })
        .populate({
          path: "doctorId",
          select: "_id firstName lastName email image",
        });
      }
      
      res.render("subadmin/prescription/list", {result,title,layout: "layout/layout2"});
    } catch (error) {
      console.log(error);
    }
  },
  prescriptionView: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      let title = "prescription";
      
      const result = await prescription.findOne({
          _id : req.params.id
        });
       
      res.render("subadmin/prescription/view",{title,result,layout: "layout/layout2"});
    
    } catch (error) {
      console.log(error);
    }
  },
  
//   assignSubAdmin: async (req, res) => {
//     try {
//       let new_patient = [];
//       new_patient.push(req.body.Patient_id);
//       let subAdmin = await users.findById(req.body.sub_admin_id);
//       let oldPatients = subAdmin.patients || [];
//       // console.log(oldPatients,">>oldPatients");

//       let addedPatient = oldPatients.concat(new_patient);
//       // console.log(addedPatient,"<>>>>>>>>>>>>addedPatient");
//       // console.log(req.body.sub_admin_id,"req.body.sub_admin_id");
//       // return
//       const get_all_sub_admin = await users.findByIdAndUpdate({
//         _id : req.body.sub_admin_id,},{
//           patients : addedPatient,
//           // AssignedSubAdminId : req.body.sub_admin_id,
//       });
//       await users.findByIdAndUpdate({
//         _id : req.body.Patient_id,},{
//           // patients : addedPatient,
//           AssignedSubAdminId : req.body.sub_admin_id,
//       });

//       res.json(1);

//     } catch (error) {
//       console.log(error);
//     }
//   },
//   doctorprescription: async (req, res) => {
//     try {
//         if (!req.session.user) return res.redirect("/admin/login");
//         const title = "doctorprescription";
//         const result = await doctor_prescription.find().populate({
//             path: "doctorId",
//             select: "_id firstName lastName image role AssignedSubAdminId"
//         }).sort({ createdAt: "desc" });

//         const get_all_sub_admin = await users.find({
//           role : 1
//         }).sort({ createdAt: "desc" });

//         // console.log(result,get_all_sub_admin,">>>>>>>>>>>>>>");
//         // return

//         res.render("dashboard/prescription/doctorlist", {result,get_all_sub_admin,title,msg:req.flash("msg")});
//     } catch (error) {
//       console.log(error);
//     }
//   },
//   assignSubAdminDoctor: async (req, res) => {
//     try {
//       let new_doctor = [];
//       new_doctor.push(req.body.doctor_id);
//       let subAdmin = await users.findById(req.body.sub_admin_id);
//       let oldDoctors = subAdmin.patients || [];

//       let addedDoctor = oldDoctors.concat(new_doctor);
//       const get_all_sub_admin = await users.findByIdAndUpdate({
//         _id : req.body.sub_admin_id,},{
//           doctors : addedDoctor,
//           // AssignedSubAdminId : req.body.sub_admin_id,
//       });
//       await users.findByIdAndUpdate({
//         _id : req.body.doctor_id,},{
//           // patients : addedPatient,
//           AssignedSubAdminId : req.body.sub_admin_id,
//       });

//       res.json(1);

//     } catch (error) {
//       console.log(error);
//     }
//   },
//   prescriptionViewDoctor: async (req, res) => {
//     try {
//       if (!req.session.user) return res.redirect("/admin/login");
//       let title = "doctorprescription";
      
//       const result = await doctor_prescription.findOne({
//           _id : req.params.id
//         });
       
//       res.render("dashboard/prescription/doctorView",{title,result});
    
//     } catch (error) {
//       console.log(error);
//     }
//   },

  

};
