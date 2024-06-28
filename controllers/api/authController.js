const helper = require("../../helper/helper");
var CryptoJS = require("crypto-js");
const moment = require("moment");
const users = require("../../models/users");
const { Validator } = require('node-input-validator');
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

module.exports = {

    signUp: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                firstName: 'required',
                lastName: 'required',
                email: 'required|email',
                password: 'required',
                countrycode: 'required',
                phoneNumber: 'required',
                role: 'required|in:2,3',  // 0 = admin, 1 = subAdmin 2 = Patient 3 = doctor
                deviceToken: 'required',
                deviceType: 'required',  // 1 for android , 2 for IOs
                address: 'required',
                location: 'required',
                latitude: 'required',
                longitude: 'required',
                gender: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)

            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            if (req.body.role == 2) {// 2 = Patient
                const v1 = new Validator(req.body, {
                    cpfId: 'required',
                    dob: 'required',
                    // address: 'required',
                    // location: 'required',
                    // latitude: 'required',
                    // longitude: 'required',
                });

                let errorsResponse = await helper.checkValidation(v1)
                if (errorsResponse) {
                    return await helper.failed(res, errorsResponse)
                }
            }
            if (req.body.role == 3) { // 3 = doctor
                const v2 = new Validator(req.body, {
                    categoryId: 'required',
                    doctorId: 'required',
                });

                let errorsResponse2 = await helper.checkValidation(v2)
                if (errorsResponse2) {
                    return await helper.failed(res, errorsResponse2)
                }
                if (await users.findOne({
                    doctorId: req.body.doctorId
                })) {
                    return helper.failed(res, "Doctor Id Already Exists!");
                }
            }

            if (await users.findOne({
                email: req.body.email
            })) {
                return helper.failed(res, "Email Already Exists!");
            }

            if (await users.findOne({
                countrycode: req.body.countrycode,
                phoneNumber: req.body.phoneNumber
            })) {
                return helper.failed(res, "Phone Number Already Exists!");
            }

            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    image = helper.fileUpload(image, "profile");
                }
            }
            let login_time = helper.unixTimestamp();
            var cipherPass = CryptoJS.AES.encrypt(req.body.password, process.env.secretCryptoKey).toString();
            let otp = 1111;
            let signup_user = await users.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: cipherPass,
                countrycode: req.body.countrycode,
                phoneNumber: req.body.phoneNumber,
                role: req.body.role,
                otp: otp,
                cpfId: req.body.cpfId ? req.body.cpfId : '',
                dob: req.body.dob ? req.body.dob : '',
                address: req.body.address ? req.body.address : '',
                city: req.body.city ? req.body.city : '',
                state: req.body.state ? req.body.state : '',
                country: req.body.country ? req.body.country : '',
                postalCode: req.body.postalCode ? req.body.postalCode : '',
                location: req.body.location ? req.body.location : '',
                location: {
                    type: "Point",
                    coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
                },
                categoryId: req.body.categoryId,
                categoryName: req.body.categoryName,
                doctorId: req.body.doctorId ? req.body.doctorId : '',
                image: image,
                deviceToken: req.body.deviceToken,
                deviceType: req.body.deviceType,
                loginTime: login_time,
                gender: req.body.gender, // 0=other , 1=male , 2=female
                // isVerify: 0,
                // chatStatus: 0,
                // forgotPasswordToken: '',
                // notificationStatus: 1
            });
            let create_token = {
                _id: signup_user._id,
                loginTime: login_time
            }

            const jtoken = jwt.sign(create_token, process.env.secretCryptoKey);

            let get_user = await users.findOne({
                _id : signup_user._id
            }).populate("categoryId");

            get_user._doc.token = jtoken

            // signup_user._doc.token = jtoken

            return helper.success(res, "successfuly", get_user);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    login: async (req, res) => {
        try {
            if (req.body.email) {
                const v = new Validator(req.body, {
                    email: 'required|email',
                    password: 'required',
                    // role: 'required|in:2,3',  // 0 = admin, 1 = subAdmin 2 = Patient 3 = doctor
                    deviceToken: 'required',
                    deviceType: 'required',  // 1 for android , 2 for IOs
                });

                let errorsResponse = await helper.checkValidation(v)
                if (errorsResponse) {
                    return await helper.failed(res, errorsResponse)
                }
                var chk_email = await users.findOne({
                    email: req.body.email
                });
                if (!chk_email) {
                    return helper.failed(res, "Email not Exists!");
                }
            } else {
                const v = new Validator(req.body, {
                    password: 'required',
                    phoneNumber: 'required',
                    // role: 'required|in:2,3',  // 0 = admin, 1 = subAdmin 2 = Patient 3 = doctor
                    deviceToken: 'required',
                    deviceType: 'required',  // 1 for android , 2 for IOs
                });

                let errorsResponse = await helper.checkValidation(v)
                if (errorsResponse) {
                    return await helper.failed(res, errorsResponse)
                }
                var chk_phn = await users.findOne({
                    phoneNumber: req.body.phoneNumber
                });
                if (!chk_phn) {
                    return helper.failed(res, "Phone Number not Exists!");
                }
            }
            // const get_user_details = await users.findOne({
            //      _id: chk_email._id 
            // });
            let get_user_details = chk_email ? chk_email : chk_phn

            var passwordBytes = CryptoJS.AES.decrypt(get_user_details.password, process.env.secretCryptoKey);
            var originalText = passwordBytes.toString(CryptoJS.enc.Utf8);
            let login_time = helper.unixTimestamp();

            if (originalText == req.body.password) {
                await users.findByIdAndUpdate({
                    _id: get_user_details._id
                },
                    {
                        deviceToken: req.body.deviceToken,
                        deviceType: req.body.deviceType,
                        loginTime: login_time

                    });
                    
                const get_user_data = await users.findOne({
                    _id: get_user_details._id
                }).populate("categoryId");

                let create_token = {
                    _id: get_user_details._id,
                    loginTime: login_time
                }

                const jtoken = jwt.sign(create_token, process.env.secretCryptoKey);

                get_user_data._doc.token = jtoken

                return helper.success(res, "Login successfully", get_user_data);
            } else {
                return helper.failed(res, "password Not Matched");
            }
        } catch (error) {
            return helper.failed(res, error);
        }


    },
    otpVerify: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                otp: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            const chk_otp = await users.findOne({
                otp: req.body.otp,
                _id: req.user._id
            });
            if(chk_otp){
                await users.findByIdAndUpdate(
                    req.user._id,{
                        isVerify: 1,
                        otp: 0
                });
                const get_user_data = await users.findOne({
                    _id: req.user._id
                });
                return helper.success(res, "OTP verified successfully", get_user_data);
            }
            return helper.failed(res, "Invalid OTP!");

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    resendOtp: async (req, res) => {
        try {
            var new_otp = Math.floor(1000 + Math.random() * 9000);
        
            await users.findByIdAndUpdate(
                req.user._id, 
                { otp: new_otp });
            const get_user_data = await users.findOne({
                _id: req.user._id
            }).populate("categoryId");
            return helper.success(res, "Resend OTP send successfully", get_user_data);
            
        } catch (error) {
            return helper.failed(res, error);
        }
    },
    chatStatus: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                chatStatus: 'required', //0=not 1=allow
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            const update_status = await users.findByIdAndUpdate(req.user._id,{
                chatStatus: req.body.chatStatus,
            });
            const get_user_data = await users.findOne({
                _id: req.user._id
            }).populate("categoryId");
            return helper.success(res, "Chat staus updated successfully", get_user_data);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    getProfile: async (req, res) => {
        try {
            const get_user_data = await users.findOne({
                _id: req.user._id
            }).populate("categoryId");
    
            return helper.success(res, "Profile fetched successfully", get_user_data);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    editProfile: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                firstName: 'required',
                lastName: 'required',
                // email: 'required|email',
                countrycode: 'required',
                phoneNumber: 'required',
                role: 'required|in:2,3',  // 0 = admin, 1 = subAdmin 2 = Patient 3 = doctor
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            let chk_phn = await users.findOne({
                countrycode: req.body.countrycode,
                phoneNumber: req.body.phoneNumber,
                _id : {$ne : req.user._id}
            });
            if(chk_phn){
                return helper.failed(res, "Phone Number Already Exists!");
            }
        
            if (req.files && req.files.image) {
                var image = req.files.image;
                if (image) {
                    image = helper.fileUpload(image, "profile");
                }
            }
            const get_user_data = await users.findOne({
                _id: req.user._id
            });

            if (req.body.role == 2) {// 2 = Patient
                const v1 = new Validator(req.body, {
                    cpfId: 'required',
                    dob: 'required',
                    address: 'required',
                });

                let errorsResponse = await helper.checkValidation(v1)
                if (errorsResponse) {
                    return await helper.failed(res, errorsResponse)
                }
                let chk_cpf = await users.findOne({
                    cpfId: req.body.cpfId,
                    _id : {$ne : req.user._id}
                });
                if(chk_cpf){
                    return helper.failed(res, "CPF Id Already Exists!");
                }
                
                await users.findByIdAndUpdate({
                    _id: req.user._id,
                }, {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    // email: req.body.email,
                    countrycode: req.body.countrycode,
                    phoneNumber: req.body.phoneNumber,
                    cpfId: req.body.cpfId ? req.body.cpfId : get_user_data.cpfId,
                    dob: req.body.dob ? req.body.dob : get_user_data.dob,
                    address: req.body.address ? req.body.address : get_user_data.address,
                    city: req.body.city ? req.body.city : get_user_data.city,
                    state: req.body.state ? req.body.state : get_user_data.state,
                    country: req.body.country ? req.body.country : get_user_data.country,
                    postalCode: req.body.postalCode ? req.body.postalCode : get_user_data.postalCode,
                    gender: req.body.gender ? req.body.gender : get_user_data.gender,
                    image: image ? image : get_user_data.image,
                });
            }
            if (req.body.role == 3) { // 3 = doctor
                const v2 = new Validator(req.body, {
                    categoryId: 'required',
                    doctorId: 'required',
                    categoryName: 'required',
                });

                let errorsResponse2 = await helper.checkValidation(v2)
                if (errorsResponse2) {
                    return await helper.failed(res, errorsResponse2)
                }
                let chk_doctor_id = await users.findOne({
                    doctorId: req.body.doctorId,
                    _id : {$ne : req.user._id}
                });
                if(chk_doctor_id){
                    return helper.failed(res, "Doctor Id Already Exists!");
                }
                await users.findByIdAndUpdate({
                    _id: req.user._id,
                }, {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    // email: req.body.email,
                    countrycode: req.body.countrycode,
                    phoneNumber: req.body.phoneNumber,
                    categoryId: req.body.categoryId,
                    categoryName: req.body.categoryName ? req.body.categoryName:get_user_data.categoryName,
                    doctorId: req.body.doctorId,
                    gender: req.body.gender ? req.body.gender : get_user_data.gender,
                    image: image ? image : get_user_data.image,
                    address: req.body.address ? req.body.address : get_user_data.address,
                    city: req.body.city ? req.body.city : get_user_data.city,
                    state: req.body.state ? req.body.state : get_user_data.state,
                    country: req.body.country ? req.body.country : get_user_data.country,
                    postalCode: req.body.postalCode ? req.body.postalCode : get_user_data.postalCode,
                });
            }
            const get_user_details = await users.findOne({
                _id: req.user._id
            }).populate("categoryId");

            return helper.success(res, "Profile updated successfully", get_user_details);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    changePassword: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                oldPassword: 'required',
                newPassword: 'required',
                confirmPassword: 'required|same:newPassword',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            let chk_user = await users.findOne({
                _id: req.user._id
            });
            if (!chk_user) {
                return helper.failed(res, "User not Exists!");
            }

            var passwordBytes = CryptoJS.AES.decrypt(chk_user.password, process.env.secretCryptoKey);
            var originalText = passwordBytes.toString(CryptoJS.enc.Utf8);
            var cipherPass = CryptoJS.AES.encrypt(req.body.newPassword, process.env.secretCryptoKey).toString();

            if(originalText == req.body.newPassword){
                return helper.failed(res, "Old and new password can not be same.");
            }

            if (originalText == req.body.oldPassword) {
                await users.findByIdAndUpdate({
                    _id: chk_user._id
                },
                    {
                        password: cipherPass,
                    });

                return helper.success(res, "Password changed successfully", chk_user);
            } else {
                return helper.failed(res, "Old password not matched!");
            }
        } catch (error) {
            return helper.failed(res, error);
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                email: 'required|email',
            });
            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                console.log(errorsResponse)
                return helper.failed(res, errorsResponse)
            }
            const check_email = await users.findOne({
                email: req.body.email
            });
            if (!check_email) {
                return helper.failed(res, "Please Check your email and try again!!!!")
            }

            // Generate a random token
            let ran_token = Math.random().toString(36).substring(2, 25);

            // Update the user with the forgotPasswordToken
            await users.findOneAndUpdate(
                { email: req.body.email },
                { forgotPasswordToken: ran_token }
            );

            // Construct the reset password URL
            const forgotPasswordUrl = `${req.protocol}://${req.get('host')}/api/resetPassword/${check_email._id}/${ran_token}`;

            // Construct the email body
            const forgotPasswordHtml = `Hello ${check_email.firstName},<br> Your Forgot Password Link is: <a href="${forgotPasswordUrl}"><u>CLICK HERE TO RESET PASSWORD</u></a>.<br><br><br> Regards,<br> Thronus`;

            // Create a nodemailer transporter
            const transporter = nodemailer.createTransport({
                host: process.env.smtp_host,
                port: process.env.smtp_port,
                auth: {
                    user: process.env.smtp_user,
                    pass: process.env.smtp_pass
                }
            });

            // Send the email
            await transporter.sendMail({
                from: '"Thronus 👻" thronus@gmail.com',
                to: req.body.email,
                subject: "Thronus | Forget Password Link",
                text: "Thronus",
                html: forgotPasswordHtml,
            });

            return helper.success(res, "Email sent. Please check your email.");
        } catch (error) {
            console.log(error);
            return helper.failed(res, error);
        }
    },
    resetPassword: async (req, res) => {
        try {
            // console.log("object");
            let token = req.params.ran_token;
            let user_id = req.params.id;

            let checkToken = await users.findOne({
                forgotPasswordToken: token
            });
            // console.log(checkToken, ">>>>>>>>>>checkToken");

            if (checkToken) {
                res.render("forgot_password", { layout: false, 'token': token, 'id': user_id, 'tokenFound': 1 });
            } else {
                res.render("forgot_password", { layout: false, 'token': token, 'id': user_id, 'tokenFound': 0 });
            }
        } catch (error) {
            console.log(error);
            return await helper.failed(res, error);
        }
    },
    updateResetPassword: async (req, res) => {
        try {
            let check_token = await users.findOne({
                forgotPasswordToken: req.body.token
            });
            if (check_token) {
                const v = new Validator(req.body, {
                    password: 'required',
                    confirm_password: 'required|same:password',
                });
                let errorsResponse = await helper.checkValidation(v)
                if (errorsResponse) {
                    console.log(errorsResponse)
                    return await helper.failed(res, errorsResponse)
                }
                var password = req.body.password;
                var cipherPass = CryptoJS.AES.encrypt(password, process.env.secretCryptoKey).toString()
                // Update password for the user
                await users.findByIdAndUpdate(check_token._id, { password: cipherPass });
                // Clear the forgotPasswordToken
                await users.findByIdAndUpdate(check_token._id, { forgotPasswordToken: '' });
                res.render('messaage_success', { layout: false });
            } else {
                res.render("forgot_password", { layout: false, 'token': 0, 'id': 0, 'tokenFound': 0 });
            }

        } catch (error) {
            console.log(error);
            return helper.failed(res, error);
        }
    },
    logout: async (req, res) => {
        try {
            await users.findByIdAndUpdate({
                _id: req.user._id,
            }, {
                loginTime: '',
                deviceToken: ''
            });

            return helper.success(res, "Logout successfully",);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    imageUpload: async (req, res) => {
        try {
            const v = new Validator(req.files, {
                image : "required"
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
            let uploaded_img ={
                image : image
            }

            return helper.success(res, "Image Uploaded successfully",uploaded_img);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    notificationStatus: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                status : "required" // 0=off , 1=on
            });

            let errorsResponse = await helper.checkValidation(v)

            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            let update_status = await users.findByIdAndUpdate({
                _id : req.user._id,},{
                    notificationStatus : req.body.status
            });
            var msg = "Notification status is ON";
            var new_status = 1;
            if(req.body.status == 0){
                msg = "Notification status is OFF";
                new_status = 0;
            }
            let data = {
                 notificationStatus : new_status
            }
            return helper.success(res,msg,data);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    emailNotificationStatus: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                status : "required" // 0=off , 1=on
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            let update_status = await users.findByIdAndUpdate({
                _id : req.user._id,},{
                    emailNotificationStatus : req.body.status
            });
            var msg = "Email Notification status is ON";
            var new_status = 1;
            if(req.body.status == 0){
                msg = "Email Notification status is OFF";
                new_status = 0;
            }
            let data = {
                emailNotificationStatus : new_status
           }
            return helper.success(res,msg,data);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    getStaffId: async (req, res) => {
        try {
            let get_staff_id = await users.findOne({
                _id : req.user._id
            }).select('_id AssignedSubAdminId');

            return helper.success(res,"Get Staff Id",get_staff_id);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
}








