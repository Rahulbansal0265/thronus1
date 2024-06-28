const helper = require("../../helper/helper");
const notification = require("../../models/notification");
const user = require("../../models/users");
const { Validator } = require('node-input-validator');

module.exports = {

    notificationListing: async (req, res) => {
        try {
            let get_notification = await notification.find({
                receiverId : req.user._id
            }).populate({
                path : "receiverId",
                select : "_id role firstName lastName email phoneNumber image"
            }).populate({
                path : "senderId",
                select : "_id role firstName lastName email phoneNumber image"
            }).sort({ createdAt: "desc" });
            return helper.success(res, "Notification listing fetch successfully",get_notification);
            
        } catch (error) {
            return helper.failed(res, error);
        }  
    },
    // newsDetails: async (req, res) => {
    //     try {
    //         const v = new Validator(req.body, {
    //             newsId: 'required',
    //         });

    //         let errorsResponse = await helper.checkValidation(v)
    //         if (errorsResponse) {
    //             return await helper.failed(res, errorsResponse)
    //         }
    //         const news_details = await news.findOne({
    //             _id: req.body.newsId
    //         });
            
    //         return helper.success(res, "News details fetch successfully",news_details);
            
    //     } catch (error) {
    //         return helper.failed(res, error);
    //     }  
    // },
}








