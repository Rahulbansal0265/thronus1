const helper = require("../../helper/helper");
const users = require("../../models/users");
const prescription = require("../../models/prescriptions");
const doctorPrescription = require("../../models/doctor_precription");
const { Validator } = require('node-input-validator');

module.exports = {

    doctorList: async (req, res) => {
        try {
            let get_all_doctors = await users.find({
                role : 3  //0=admin, 1=subAdmin, 2=Patient, 3=doctor
            }).populate("categoryId").sort({ createdAt: "desc" });
            return helper.success(res, "Doctors listing fetch successfully",get_all_doctors);
            
        } catch (error) {
            return helper.failed(res, error);
        }  
    },
    doctorDetails: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                doctorId: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            const doctor_details = await users.findOne({
                _id: req.body.doctorId
            }).populate("categoryId");
            
            return helper.success(res, "Doctors details fetch successfully",doctor_details);
            
        } catch (error) {
            return helper.failed(res, error);
        }  
    },
    myDoctorList: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                limit: 'required',
                offset: 'required',
            });
    
            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
    
            const limitpage = parseInt(req.body.limit);
            const offsetpage = parseInt(req.body.offset);
    
            const offset = offsetpage * limitpage;
    
            let get_all_doctors = await prescription.find({
                patientId: req.user._id
            })
            .populate({
                path: "doctorId",
                select: "_id firstName lastName email role image chatStatus address categoryId categoryName",
                populate: "categoryId"
            })
            .sort({ createdAt: "desc" })
            .skip(offset)
            .limit(limitpage);
    
            let get_all_doctors1 = await doctorPrescription.find({
                email: req.user.email
            })
            .populate({
                path: "doctorId",
                select: "_id firstName lastName email role image chatStatus address categoryId categoryName",
                populate: "categoryId"
            })
            .sort({ createdAt: "desc" })
            .skip(offset)
            .limit(limitpage);
    
            let mergedArray = [...get_all_doctors, ...get_all_doctors1];
    
            let doctorMap = new Map();
            mergedArray.forEach(item => {
                const doctorId = item.doctorId._id.toString();
                if (!doctorMap.has(doctorId)) {
                    doctorMap.set(doctorId, item);
                }
            });
    
            let uniqueDoctors = Array.from(doctorMap.values());
    
            return helper.success(res, "My Doctors listing fetch successfully", uniqueDoctors);
            
        } catch (error) {
            return helper.failed(res, error);
        }  
    },
    
    // myDoctorList: async (req, res) => {
    //     try {
    //         const v = new Validator(req.body, {
    //             limit: 'required',
    //             offset: 'required',
    //         });
    
    //         let errorsResponse = await helper.checkValidation(v)
    //         if (errorsResponse) {
    //             return await helper.failed(res, errorsResponse)
    //         }
    
    //         const limitpage = parseInt(req.body.limit);
    //         const offsetpage = parseInt(req.body.offset);
    
    //         const offset = offsetpage * limitpage;
    
    //         let get_all_doctors = await prescription.find({
    //             patientId: req.user._id
    //         })
    //         .populate({
    //             path: "doctorId",
    //             select: "_id firstName lastName email role image chatStatus address categoryId",
    //             populate: "categoryId"
    //         })
    //         .sort({ createdAt: "desc" })
    //         .skip(offset)
    //         .limit(limitpage);
    
    //         let get_all_doctors1 = await doctorPrescription.find({
    //             email: req.user.email
    //         })
    //         .populate({
    //             path: "doctorId",
    //             select: "_id firstName lastName email role image chatStatus address categoryId",
    //             populate: "categoryId"
    //         })
    //         .sort({ createdAt: "desc" })
    //         .skip(offset)
    //         .limit(limitpage);
    
    //         let mergedArray = [...get_all_doctors, ...get_all_doctors1];
    
    //         // mergedArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    //         return helper.success(res, "My Doctors listing fetch successfully", mergedArray);
            
    //     } catch (error) {
    //         return helper.failed(res, error);
    //     }  
    // },
    
    
    
}








