
const helper = require("../../helper/helper");
const reward = require("../../models/reward");
const { Validator } = require('node-input-validator');

module.exports = {

    getRewards: async (req, res) => {
        try {
            let get_reward = await reward.find().sort({ createdAt: "desc" });
            return helper.success(res, "Reward listing fetch successfully",get_reward);
            
        } catch (error) {
            return helper.failed(res, error);
        }  
    },
    rewardDetails: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                rewardId: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            const reward_details = await reward.findOne({
                _id: req.body.rewardId
            });
            
            return helper.success(res, "Reward details fetch successfully",reward_details);
            
        } catch (error) {
            return helper.failed(res, error);
        }  
    },
}








