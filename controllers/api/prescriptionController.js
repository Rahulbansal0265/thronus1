const helper = require("../../helper/helper");
const prescription = require("../../models/prescriptions");
const user = require("../../models/users");
const doctor_prescription = require("../../models/doctor_precription");
const invoice = require("../../models/invoice");
const notification = require("../../models/notification");
const { Validator } = require('node-input-validator');
const { default: mongoose } = require("mongoose");

module.exports = {

    addpatientprescription: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                doctorId: 'required',
                title: 'required',
                note: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }

            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    image = helper.fileUpload(image, "prescription");
                }
            }

            let save_prescription = await prescription.create({
                doctorId: req.body.doctorId,
                title: req.body.title,
                note: req.body.note,
                image: image ? image : '',
                patientId: req.user._id,
            });

            return helper.success(res, "Patient prescription saved successfully", save_prescription);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    patientPrescriptionList: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                type: 'required', // 1=me  2=doctor
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            if (req.body.type == 1) {
                let get_prescription = await prescription.find({
                    patientId: req.user._id,
                }).sort({ createdAt: "desc" });

                return helper.success(res, "Patient prescription listing fetch successfully", get_prescription);
            } else {
                let get_prescription_doctor = await doctor_prescription.find({});
                var get_my_prescription_doctor = [];
                if (get_prescription_doctor.length > 0) {
                    for (let i in get_prescription_doctor) {
                        var get_user = await user.find({
                            email: get_prescription_doctor[i].email,
                            _id: req.user._id
                        }).sort({ createdAt: "desc" });
                    }

                    // get prescription upload by doctor for me
                    if (get_user.length > 0) {
                        for (let j in get_user) {
                            get_my_prescription_doctor = await doctor_prescription.find({
                                email: get_user[j].email
                            }).sort({ createdAt: "desc" });

                        }
                    }

                }
                // let data = {
                //     prescription_uploaded_by_me : get_prescription,
                //     prescription_uploaded_by_doctor : get_my_prescription_doctor,
                // }

                return helper.success(res, "Patient prescription listing fetch successfully", get_my_prescription_doctor);
            }
        } catch (error) {
            return helper.failed(res, error);
        }
    },
    addDoctorPrescription: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                title: 'required',
                patientName: 'required',
                email: 'required|email',
                countryCode: 'required',
                phoneNumber: 'required',
                note: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            let get_user = await user.findOne({
                email: req.body.email
            });
            if (!get_user) {
                return helper.failed(res, "This email does not exist, please enter a valid email!");
            }

            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    image = helper.fileUpload(image, "prescription");
                }
            }

            let save_prescription = await doctor_prescription.create({
                doctorId: req.user._id,
                note: req.body.note,
                image: image ? image : '',
                title: req.body.title,
                patientName: req.body.patientName,
                email: req.body.email,
                countryCode: req.body.countryCode,
                phoneNumber: req.body.phoneNumber,
            });

            let get_patient_details = await user.findOne({
                email: req.body.email
            });
            let all_data = {
                msg: `Prescription has been uploaded by the doctor`,
                sender_id: req.user._id,
                device_token: get_patient_details?.deviceToken,
                sender_name: req.user.firstName,
                noti_type: 3,
                image: image,
                // doctorPrescriptionId: save_prescription._id,
            }

            await helper.sendFCMnotificationImage(all_data);

            await notification.create({
                title: 'Geracao Thronus',
                senderId: req.user._id,
                receiverId: get_patient_details._id,
                image: all_data.image,
                message: all_data.msg,
                type: all_data.noti_type,
                prescriptionId: save_prescription._id,
            });

            return helper.success(res, "Doctor prescription saved successfully", save_prescription);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    DoctorPrescriptionDetail: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                doctoPrescriptionId: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }

            // let prescription_details = await doctor_prescription.findOne({
            //     _id: req.body.doctoPrescriptionId,
            // }).populate({
            //     path: "doctorId",
            //     select: "_id firstName lastName image role countrycode phoneNumber address"
            // });
            // if (prescription_details) {
            //     return helper.success(res, "Doctor prescription Details fetched successfully", prescription_details);
            // } else {
            //     return helper.failed(res, "Invalid Id!");
            // }
            const _id = new mongoose.Types.ObjectId(req?.body?.doctoPrescriptionId);
            const result = await doctor_prescription.aggregate([
                {
                    $match: {
                        _id
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "doctorId",
                        foreignField: "_id",
                        as: "doctorId"
                    }
                },
                {
                    $unwind: {
                        path: "$doctorId",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "email",
                        foreignField: "email",
                        as: "email",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "AssignedSubAdminId",
                                    foreignField: "_id",
                                    as: "AssignedSubAdminId",
                                }
                            },
                            {
                                $unwind: {
                                    path: "$AssignedSubAdminId",
                                    preserveNullAndEmptyArrays: true  // Allow for missing AssignedSubAdminId
                                }
                            },
                        ],
                    }
                },
                {
                    $unwind: {
                        path: "$email",
                        preserveNullAndEmptyArrays: false
                    }
                },
            ]);
            
            
            // const result = await doctor_prescription.aggregate(
            //     [
            //         {
            //             $match: {
            //                 _id
            //             }
            //         },
            //         {
            //             $lookup: {
            //                 from: "users",
            //                 localField: "doctorId",
            //                 foreignField: "_id",
            //                 as: "doctorId"
            //             }
            //         },
            //         {
            //             $unwind: {
            //                 path: "$doctorId",
            //                 preserveNullAndEmptyArrays: false
            //             }
            //         },
            //         {
            //             $lookup: {
            //                 from: "users",
            //                 localField: "email",
            //                 foreignField: "email",
            //                 as: "email",
            //                 pipeline: [
            //                     // {
            //                     //     $project: {
            //                     //         // firstName: 1,
            //                     //         // lastName: 1,
            //                     //         // email: 1,
            //                     //         // image: 1,
            //                     //         // AssignedSubAdminId: 1,
            //                     //     },
            //                     // },
            //                     {
            //                         $lookup: {
            //                             from: "users",
            //                             localField: "AssignedSubAdminId",
            //                             foreignField: "_id",
            //                             as: "AssignedSubAdminId",
            //                             // pipeline: [
            //                             //     {
            //                             //         $project: {
            //                             //             firstName: 1,
            //                             //             lastName: 1,
            //                             //             image: 1,
            //                             //             email: 1,
            //                             //             role: 1,
            //                             //         },
            //                             //     },
            //                             // ],
            //                         },
            //                     },
            //                     {
            //                         $unwind: "$AssignedSubAdminId",
            //                     },
            //                 ],
            //             },
            //         },
            //         {
            //             $unwind: {
            //                 path: "$email",
            //                 preserveNullAndEmptyArrays: false,
            //             },
            //         },
            //     ]
            // );
            return helper.success(res, "Doctor prescription Details fetched successfully", result[0] ? result[0] : {});
            // if (result[0]) {
            // } else {
            //     return helper.failed(res, "Invalid Id!");
            // }
        } catch (error) {
            return helper.failed(res, error);
        }
    },
    patientPrescriptionDetail: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                patientPrescriptionId: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            let prescription_details = await prescription.findOne({
                _id: req.body.patientPrescriptionId,
            }).populate({
                path: 'patientId',
                model: 'users',
                select: '_id AssignedSubAdminId',
                populate: {
                    path: "AssignedSubAdminId",
                    model: "users",
                    // select: "_id firstName lastName role email phoneNumber image"
                }

            })
                .populate({
                    path: 'doctorId',
                    model: 'users',
                    // select: "_id firstName lastName role email phoneNumber image categoryId",
                    populate: {
                        path: "categoryId",
                        model: "categories",
                        // select: "_id title"
                    }

                });

            if (prescription_details) {
                return helper.success(res, "Patient prescription Details fetched successfully", prescription_details);
            } else {
                return helper.failed(res, "Invalid Id!");
            }

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    getInvoice: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                limit: 'required',
                offset: 'required',
                type: 'required' //0=all, 1=today, 2=this_month, 3=past_3_month, 4=past_6_month, 5=last_year
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            const limitpage = parseInt(req.body.limit);
            const offsetpage = parseInt(req.body.offset);
            var offset = offsetpage * limitpage;

            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            var threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
            var sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
            var oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

            // console.log(firstDayOfMonth,">>>>>>>>firstDayOfMonth");
            // console.log(lastDayOfMonth,">>>>>>>>>>>>>>>>>>>lastDayOfMonth");
            // console.log(threeMonthsAgo,">>>>>>>>>>>>>>>>>>>>>threeMonthsAgo");
            // console.log(oneYearAgo,">>>>>>>>>>>>>>>>>>>>>oneYearAgo");

            if (req.body.type == 0) {
                let get_all_invoice = await invoice.find({
                    patientId: req.user._id,
                })
                    .populate({
                        path: 'patientId',
                        model: 'users',
                        select: '_id role firstName lastName email phoneNumber image'
                    })
                    .sort({ createdAt: "desc" })
                    .skip(offset)
                    .limit(limitpage);

                return helper.success(res, "Patient Invoice fetched successfully", get_all_invoice);
            } else if (req.body.type == 1) {
                let get_all_today_invoice = await invoice.find({
                    patientId: req.user._id,
                    createdAt: { $gte: today }
                })
                    .populate({
                        path: 'patientId',
                        model: 'users',
                        select: '_id role firstName lastName email phoneNumber image'
                    })
                    .sort({ createdAt: "desc" })
                    .skip(offset)
                    .limit(limitpage);

                return helper.success(res, "Patient Invoice fetched successfully", get_all_today_invoice);
            } else if (req.body.type == 2) {
                let get_all_current_month_invoice = await invoice.find({
                    patientId: req.user._id,
                    createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
                })
                    .populate({
                        path: 'patientId',
                        model: 'users',
                        select: '_id role firstName lastName email phoneNumber image'
                    })
                    .sort({ createdAt: "desc" })
                    .skip(offset)
                    .limit(limitpage);

                return helper.success(res, "Patient Invoice fetched successfully", get_all_current_month_invoice);
            } else if (req.body.type == 3) {
                let get_all_past_3_month_invoice = await invoice.find({
                    patientId: req.user._id,
                    createdAt: { $gte: threeMonthsAgo, $lte: lastDayOfMonth }
                })
                    .populate({
                        path: 'patientId',
                        model: 'users',
                        select: '_id role firstName lastName email phoneNumber image'
                    })
                    .sort({ createdAt: "desc" })
                    .skip(offset)
                    .limit(limitpage);

                return helper.success(res, "Patient Invoice fetched successfully", get_all_past_3_month_invoice);
            } else if (req.body.type == 4) {
                let get_all_past_6_month_invoice = await invoice.find({
                    patientId: req.user._id,
                    createdAt: { $gte: sixMonthsAgo, $lte: lastDayOfMonth }
                })
                    .populate({
                        path: 'patientId',
                        model: 'users',
                        select: '_id role firstName lastName email phoneNumber image'
                    })
                    .sort({ createdAt: "desc" })
                    .skip(offset)
                    .limit(limitpage);

                return helper.success(res, "Patient Invoice fetched successfully", get_all_past_6_month_invoice);
            } else if (req.body.type == 5) {
                let get_all_past_6_month_invoice = await invoice.find({
                    patientId: req.user._id,
                    createdAt: { $gte: oneYearAgo, $lte: lastDayOfMonth }
                })
                    .populate({
                        path: 'patientId',
                        model: 'users',
                        select: '_id role firstName lastName email phoneNumber image'
                    })
                    .sort({ createdAt: "desc" })
                    .skip(offset)
                    .limit(limitpage);

                return helper.success(res, "Patient Invoice fetched successfully", get_all_past_6_month_invoice);
            } else {
                return helper.failed(res, "Invalid type!");
            }

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    invoiceDetails: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                invoiceId: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            let invoice_details = await invoice.findOne({
                _id: req.body.invoiceId,
            })
                .populate({
                    path: 'patientId',
                    model: 'users',
                    select: '_id role firstName lastName email phoneNumber image'
                });

            if (invoice_details) {
                return helper.success(res, "Patient Invoice Details fetched successfully", invoice_details);
            } else {
                return helper.failed(res, "Invalid Id!");
            }

        } catch (error) {
            return helper.failed(res, error);
        }
    },
}








