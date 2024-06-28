
const helper = require("../../helper/helper");
const category = require("../../models/categories");
const { Validator } = require('node-input-validator');

module.exports = {

    getCategory: async (req, res) => {
        try {
            let get_category = await category.find({
                status : true,
            });
            return helper.success(res, "Category listing fetch successfully",get_category);
            
        } catch (error) {
            return helper.failed(res, error);
        }  
    },
    // rewardDetails: async (req, res) => {
    //     try {
    //         const v = new Validator(req.body, {
    //             rewardId: 'required',
    //         });

    //         let errorsResponse = await helper.checkValidation(v)
    //         if (errorsResponse) {
    //             return await helper.failed(res, errorsResponse)
    //         }
    //         const reward_details = await reward.findOne({
    //             _id: req.body.rewardId
    //         });
            
    //         return helper.success(res, "Reward details fetch successfully",reward_details);
            
    //     } catch (error) {
    //         return helper.failed(res, error);
    //     }  
    // },
}








