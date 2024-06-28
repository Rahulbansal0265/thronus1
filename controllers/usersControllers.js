const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
// var aes256 = require("aes256");
var CryptoJS = require("crypto-js");
const moment = require("moment");
const users = require("../models/users");
const prescription = require("../models/prescriptions");
const categories = require("../models/categories");
const blocked = require("../models/blockSchema");
const invoices = require("../models/invoice");
const notification = require("../models/notification");
const fileUpload = require("express-fileupload");
const env = require("dotenv").config();
const path = require("path");
const doctor = require("../models/docotors_list");
const doctor_prescription = require("../models/doctor_precription");
const nodemailer = require("nodemailer");
const secretCryptoKey = "thronus@#_Secret_KEY";
const myArray = [5, 2, 4, 2, 1, 3, 1, 0, 0, 1, 1];
const mongoose = require("mongoose");

// Create an object to store counts
const elementCounts = {};

// Loop through the array
myArray.forEach((element) => {
  // Check if the element exists in the counts object
  if (elementCounts[element] === undefined) {
    // If not, initialize it with a count of 1
    elementCounts[element] = 1;
  } else {
    // If it exists, increment the count
    elementCounts[element]++;
  }
});
module.exports = {
  usersList: async (req, res) => {
    try {
      const title = "Patients List";
      if (!req.session.user) return res.redirect("/admin/login");
      const result = await users.find({ role: 2 }).sort({ createdAt: "desc" });
      const get_all_sub_admin = await users.find({
        role : 1
      }).sort({ createdAt: "desc" });
      res.render("dashboard/users/patientList", { result, title,get_all_sub_admin });
    } catch (error) {}
  },
  doctor_bulk_add: async (req, res) => {
    try {
      const title = "Patients List";
      res.render("doctorPanel/users/doctor_bulk_add", { title });
    } catch (error) {
      console.log(error);
    }
  },
  doctor_add: async (req, res) => {
    try {
      const title = "doctorsList";
      if (!req.session.user) return res.redirect("/admin/login");
      let getCategory = await categories.find({
        status : true
      });
      // console.log(getCategory,">>>>>>>>>>>>>>>>>>");
      res.render("dashboard/users/addDoctor", { getCategory,title });
    } catch (error) {
      console.log(error);
    }
  },
  addDoctor: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const { fName, lName, email, mobile, password, doctorId,healthProfessional } =
        req.body;

      if (!fName || !lName || !email) {
        return res.status(400).send({
          message: ",Role, fName lName, and email are required fields.",
        });
      }
      const existingUser = await users.findOne({
        $or: [{ email }, { phoneNumber: mobile }],
      });
      if (existingUser) {
        return res.status(400).send({
          message:
            "User with the provided email or phone number already exists.",
        });
      }
      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          image = helper.fileUpload(image, "profile");
        }
      }

      var hash = CryptoJS.AES.encrypt(password, secretCryptoKey).toString();

      const user = await users.create({
        role: "3",
        firstName: fName,
        lastName: lName,
        email,
        phoneNumber: mobile,
        image,
        password: hash,
        healthprofissonl: healthProfessional,
        doctorId: doctorId,
      });

      res.redirect("/admin/doctorsList");
    } catch (error) {}
  },
  doctorsList: async (req, res) => {
    try {
      const title = "doctorsList";
      if (!req.session.user) return res.redirect("/admin/login");
      const result = await users.find({ role: 3 }).sort({ createdAt: "desc" });
      const get_all_sub_admin = await users.find({
        role : 1
      }).sort({ createdAt: "desc" });
      // const user2 = await doctor.find().sort({ createdAt: "desc" });
      // const result = [...user, ...user2];
      res.render("dashboard/users/doctorList", { result, title ,get_all_sub_admin});
    } catch (error) {}
  },
  // get_data: async (req, res) => {
  //   try {
  //     const title = "doctorsList";
  //     if (!req.session.user) return res.redirect("/admin/login");
  //     const result = await users.find({ role: 3 }).sort({ createdAt: "desc" });
  //     const get_all_sub_admin = await users.find({
  //       role : 3
  //     }).sort({ createdAt: "desc" });
  //     var data_arr = [];
  //     get_all_sub_admin.forEach(function(key,value){
  //       data_arr.push({
  //         's_no' : key,
  //         'name' : value.firstName+" "+value.lastName,
  //         'email' : value.email,
  //         'phoneNumber' : value.phoneNumber,
  //         'image' : value.phoneNumber,
  //         'status' : value.phoneNumber,
  //         'AssignedSubAdminId' : value.phoneNumber,
  //         'action' : value.phoneNumber,
  //     });
  //       console.log(key,value,">>>>>>>>");
  //     });
  //     response.json(data_arr);
  //     // const user2 = await doctor.find().sort({ createdAt: "desc" });
  //     // const result = [...user, ...user2];
  //     // res.render("dashboard/users/doctorList", { result, title ,get_all_sub_admin});
  //   } catch (error) {}
  // },
  // doctorsList: async (req, res) => {
  //   try {
  //       const title = "doctorsList";
  //       if (!req.session.user) return res.redirect("/admin/login");
        
  //       const page = parseInt(req.query.page) || 1;
  //       const skip = (page - 1) * PAGE_SIZE;
        
  //       const [result, totalRecords, get_all_sub_admin] = await Promise.all([
  //           users.find({ role: 3 }).sort({ createdAt: "desc" }).skip(skip).limit(PAGE_SIZE),
  //           users.countDocuments({ role: 3 }),
  //           users.find({ role: 1 }).sort({ createdAt: "desc" })
  //       ]);

  //       const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  //       res.render("dashboard/users/doctorList", { result, title, get_all_sub_admin, currentPage: page, totalPages });
  //   } catch (error) {
  //       console.error(error);
  //       res.status(500).send("Internal Server Error");
  //   }
  // },
  editDoctor: async (req, res) => {
    try {
      const title = "doctorsList";
      if (!req.session.user) return res.redirect("/admin/login");
      let getCategory = await categories.find({
        status : true
      });
      let user = await users.findById({
        _id : req.params.id
      }).populate("categoryId");
      
      res.render("dashboard/users/addDoctor", { user,getCategory,title });
    } catch (error) {}
  },
  blockedList: async (req, res) => {
    try {
      const title = "Blocked List";
      if (!req.session.user) return res.redirect("/admin/login");
      const user = await blocked
        .find()
        .populate("blockedBy")
        .populate("blockedTo");

      res.render("dashboard/blocked/list", { user, title });
    } catch (error) {}
  },
  UserCreate: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      let title = "Doctors List";
      res.render("dashboard/users/editUser", { title });
    } catch (error) {
      return res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  addUser: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const { fName, lName, email, mobile, password, healthprofissonl } =
        req.body;

      if (!fName || !lName || !email) {
        return res.status(400).send({
          message: ",Role, fName lName, and email are required fields.",
        });
      }
      const existingUser = await users.findOne({
        $or: [{ email }, { phoneNumber: mobile }],
      });
      if (existingUser) {
        return res.status(400).send({
          message:
            "User with the provided email or phone number already exists.",
        });
      }
      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          image = helper.fileUpload(image, "profile");
        }
      }

      // const sendData = `Hello ${fName},<br>Welcome to Geracao Thronus your account credentials is email : ${email} <br> password : ${password}<br><br><br> Regards,<br> Geracao Thronus`;

      //       // Create a nodemailer transporter
      //       const transporter = nodemailer.createTransport({
      //           host: process.env.smtp_host,
      //           port: process.env.smtp_port,
      //           auth: {
      //               user: process.env.smtp_user,
      //               pass: process.env.smtp_pass
      //           }
      //       });

      //       // Send the email
      //       await transporter.sendMail({
      //           from: '"Thronus 👻" thronus@gmail.com',
      //           to: email,
      //           subject: "Thronus | Account Credentials",
      //           text: "Thronus",
      //           html: sendData,
      //       });

      // const location = {};
      // if ((lat, long)) {
      //   location.type = "Point";
      //   location.coordinates = [parseFloat(lat), parseFloat(long)];
      // }

      var hash = CryptoJS.AES.encrypt(password, secretCryptoKey).toString();

      const user = await users.create({
        role: "1",
        firstName: fName,
        lastName: lName,
        email,
        phoneNumber: mobile,
        image,
        password: hash,
      });

      res.redirect("/admin/subAdminList");
    } catch (error) {}
  },
  updateDoctor: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      // console.log(req.body,">>>>>>>>>>>>>>>>>>req.body");
      // console.log(req.files,">>>>>>>>>>>>>>>>>>req.body");
      // return
      if(req.files != 'null'){
        if (req.files && req.files.image) {
          var image = req.files.image;
          if (image) {
            image = helper.fileUpload(image, "profile");
          }
        }
      }
      let old_data = await users.findById({
        _id : req.body.id
      });
      const user = await users.findByIdAndUpdate(
        { _id: req.body.id },
        {
          firstName: req.body.fName?req.body.fName:old_data.firstName,
          lastName: req.body.lName?req.body.lName:old_data.lastName,
          phoneNumber: req.body.mobile?req.body.mobile:old_data.phoneNumber,
          image: image?image:old_data.image,
          doctorId: req.body.doctorId?req.body.doctorId:old_data.doctorId,
        }
      );

      res.redirect("/admin/doctorsList");
    } catch (error) {}
  },
  updateUser: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const { fName, lName, email, mobile, password } = req.body;

      if (!fName || !lName || !email) {
        return res.status(400).send({
          message: ",Role, fName lName, and email are required fields.",
        });
      }
      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          image = helper.fileUpload(image, "profile");
        }
      }
      // const existingUser = await users.findOne({
      //   $or: [{ email }, { phoneNumber: mobile }],
      // });
      // if (existingUser) {
      //   return res.status(400).send({
      //     message:
      //       "User with the provided email or phone number already exists.",
      //   });
      // }

      var hash = CryptoJS.AES.encrypt(password, secretCryptoKey).toString();
      const user = await users.findByIdAndUpdate(
        { _id: req.body.id },
        {
          role: "1",
          firstName: fName,
          lastName: lName,
          email,
          phoneNumber: mobile,
          image,
          password: hash,
        }
      );

      res.redirect("/admin/subAdminList");
    } catch (error) {}
  },
  blockedStatus: async (req, res) => {
    try {
      const id = req.body.id;
      const user = await blocked.findByIdAndUpdate(
        { _id: id },
        { status: req.body.status }
      );
      if (user) {
        res.json(1);
      } else {
        res.json(0);
      }
    } catch (error) {
      return res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  status: async (req, res) => {
    try {
      const id = req.body.id;
      const user = await users.findByIdAndUpdate(
        id,
        { status: req.body.status }
      );
      if (user) {
        res.json(1);
      } else {
        res.json(0);
      }
    } catch (error) {
      return res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  //get all doctor

  getAllDoctor: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      // var mysort = { createdAt: "desc" };
      const user = await users.find({ role: 1 }).sort({ createdAt: "desc" });
      const title = "Doctors List";

      res.render("dashboard/users/subAdminList", { user, title });
    } catch (error) {}
  },
  //get all patient
  getAllPatient: async (req, res) => {
    try {
      const userData = await UserModel.find({ role: 2 }).sort({ createdAt: "desc" });
      return res.status(200).send({
        data: userData,
        message: "Get all users successfully",
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        data: userData,
        message: "Get ALL Users  successfully",
        error: error.message,
      });
    }
  },
  GetDoctorById: async (req, res) => {
    try {
      const id = req.params.id;
      const doctor = await UserModel.findById({ _id: id, role: 1 });

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      return res.status(200).json(doctor);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getPatientById: async (req, res) => {
    try {
      const id = req.params.id;
      const Patient = await UserModel.findById({ _id: id, role: 2 });

      if (!Patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      return res.status(200).json(Patient);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //<------------------------delete--------------------->
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await users.findByIdAndDelete({ _id: id });

      if (!user) {
        res.json(0);
      }
      res.json(1);

      //   return res.status(200).send({
      //     message: "User Deleted Successfully",
      //   });
    } catch (error) {
      return res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  blockedDelete: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await blocked.findByIdAndDelete({ _id: id });

      if (!user) {
        res.json(0);
      }
      res.json(1);

      //   return res.status(200).send({
      //     message: "User Deleted Successfully",
      //   });
    } catch (error) {
      return res.status(500).send({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  editUser: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");

      let title = "Doctors List";
      const user = await users.findById({ _id: req.params.id });

      res.render("dashboard/users/editUser", { user, title });
    } catch (error) {}
  },
  viewUser: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      var title = "Patients List";
     
      // var user = await users.findById({ _id: req.params.id });
      let get_user = await users.findOne({
        _id : req.params.id
      });
      var staff_name = await users.findOne({
        _id : mongoose.Types.ObjectId(get_user.AssignedSubAdminId)
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

      let get_all_doctors = await prescription.find({
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

      // var user = await users.aggregate([
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

      // let get_all_invoice = await invoices.find({
      //   patientId : req.params.id,
      // })
      // .populate({
      //   path: 'patientId',
      //   model: 'users' ,
      //   select: '_id role firstName lastName email phoneNumber image'
      // }).populate({
      //   path: 'uploadedBy',
      //   model: 'users' ,
      //   select: '_id role firstName lastName email phoneNumber image'
      // }).sort({ createdAt: "desc" });
      // console.log(get_all_invoice,">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      if(get_user.role == 3){
        title = "doctorsList";
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
        
        res.render("dashboard/users/doctorView", { user,staff_name, title ,categoryName});
      }else{
        res.render("dashboard/users/patientView", {get_user,staff_name,mergedArray,title ,get_all_invoice});
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  subAdminView: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");

      let title = "Doctors List";
      const user = await users.findById({ _id: req.params.id });

      res.render("dashboard/users/subAdminView", { user, title });
    } catch (error) {}
  },
  assignUsers: async (req, res) => {
    try {
      const data = await users.find({
        $or: [
          { firstName: { $regex: req.body.text, $options: "i" } },
          { lastName: { $regex: req.body.text, $options: "i" } },
        ],
      });

      res.json(data);
    } catch (error) {}
  },
  typeAheadSearch: async (req, res) => {
    try {
      const searchText = req.query.query;
      const results = await users
        .find({
          firstName: { $regex: searchText, $options: "i" },
        })
        .limit(10);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  uploadInvoice: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      if (req.files && req.files.invoice) {
          var image = req.files.invoice.name;
          let fileupload = image.split('.').join('_' + Date.now() + '.');
          var image_type = (req.files.invoice.mimetype.includes('image') ? 1 : 2);
          let uploadDir = path.join(__dirname, "../public/images/invoice", fileupload);
          if (req.files.invoice) {
            req.files.invoice.mv(uploadDir, (err) => {
            if (err) return res.status(500).send(err);
            });
            req.body.invoice = fileupload;
            req.body.imageType = image_type;
          }
      }
      let saveinvoice = await invoices.create({
        uploadedBy : req.session.user._id,
        patientId : req.body.userId,
        invoice : `/images/invoice/${req.body.invoice}`,
        imageType : req.body.imageType,
      });
      let get_patient_details = await users.findOne({
        _id : req.body.userId
      });
      let all_data = {
        msg: `${req.session.user.firstName} send you invoice`,
        sender_id: req.session.user._id,
        device_token: get_patient_details.deviceToken,
        sender_name: req.session.user.firstName,
        noti_type: 2,
        image: `/images/invoice/${req.body.invoice}`,
      }

      await helper.sendFCMnotificationImage(all_data);

      await notification.create({
        title: 'Geracao Thronus', 
        senderId: req.session.user._id, 
        receiverId: req.body.userId,
        image : all_data.image,
        message : `You have recieved invoice from admin as per your presceription`,//`${req.session.user.firstName} send you invoice`,
        type: all_data.noti_type,
        imageType: req.body.imageType,
      });
      res.redirect(`/admin/viewUser/${req.body.userId}`);
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  invoice: async (req, res) => {
    try {
      const title = "invoice";
      if (!req.session.user) return res.redirect("/admin/login");
      let get_all_invoice = await invoices.find()
      .populate({
        path : "patientId",
        select : "_id firstName lastName",
      })
      .populate({
        path : "uploadedBy",
        select : "_id firstName lastName",
      })
      .sort({ createdAt: "desc" });

      res.render("dashboard/invoice/invoicesList", {get_all_invoice,  title });
    } catch (error) {}
  },
  invoiceView: async (req, res) => {
    try {
      const title = "invoice";
      if (!req.session.user) return res.redirect("/admin/login");
      let get_invoice = await invoices.findOne({
        _id : req.params.id
      })
      .populate({
        path : "patientId",
        select : "_id firstName lastName",
      })
      .populate({
        path : "uploadedBy",
        select : "_id firstName lastName",
      });

      res.render("dashboard/invoice/invoicesView", {get_invoice,  title });
    } catch (error) {}
  },
  assignSubAdminDoctor: async (req, res) => {
    try {
      let new_doctor = [];
      new_doctor.push(req.body.doctor_id);
      let subAdmin = await users.findById(req.body.sub_admin_id);
      let oldDoctors = subAdmin.doctors || [];
      // console.log(subAdmin,">>subAdmin");

      let addedDoctors = oldDoctors.concat(new_doctor);
      // console.log(new_doctor,"<>>>>>>>>>>>>new_doctor");
      // console.log(req.body.sub_admin_id,"req.body.sub_admin_id");
      // return
      const get_all_sub_admin = await users.findByIdAndUpdate({
        _id : req.body.sub_admin_id,},{
          doctors : addedDoctors,
          // AssignedSubAdminId : req.body.sub_admin_id,
      });
      await users.findByIdAndUpdate({
        _id : req.body.doctor_id,},{
          // patients : addedPatient,
          AssignedSubAdminId : req.body.sub_admin_id,
      });

      res.json(1);
    } catch (error) {
      console.log(error);
    }
  },
};

