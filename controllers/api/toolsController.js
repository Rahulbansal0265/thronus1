const helper = require("../../helper/helper");
const cms = require("../../models/cms");
const tools = require("../../models/tools");
const support = require("../../models/Support");
const products = require("../../models/products");
const questions = require("../../models/questions");
const answer = require("../../models/answer");
const report = require("../../models/report");
const block = require("../../models/blockSchema");
const { Validator } = require('node-input-validator');

module.exports = {

    cms: async (req, res) => {
        try {
            const get_cms = await cms.findOne({
                type: req.params.type
            });

            return helper.success(res, "Cms fetched successfully", get_cms);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    tools: async (req, res) => {
        try {
            const get_tools = await tools.findOne({
                type: req.params.type
            });

            return helper.success(res, "Tools fetched successfully", get_tools);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    customerSupport: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                name: 'required',
                email: 'required',
                subject: 'required',
                message: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            const save_support = await support.create({
                ...req.body
            });

            return helper.success(res, "Message Send successfully", save_support);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    productList: async (req, res) => {
        try {
            const get_all_products = await products.find({});

            return helper.success(res, "Product list fetched successfully", get_all_products);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    productDetails: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                productId: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            const get_product_details = await products.findOne({
                _id: req.body.productId
            });

            return helper.success(res, "Product details fetched successfully", get_product_details);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    questionsList: async (req, res) => {
        try {
            const get_all_faq = await questions.find({});

            return helper.success(res, "FAQ list fetched successfully", get_all_faq);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    questionDetails: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                questionId: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }

            var answerObj = await answer.findOne({
                userId: req.user.id,
                questionId: req.body.questionId
            }).populate('questionId')

            const get_faq_details = await questions.findOne({
                _id: req.body.questionId
            });

            var data = { answer: answerObj, question: get_faq_details }

            return helper.success(res, "Question details fetched successfully", data);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    answer: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                questionId: 'required',
                answer: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            var chk_already_answer = await answer.findOne({
                questionId: req.body.questionId,
                userId: req.user._id,
            });
            if (chk_already_answer) {
                return helper.success(res, "Answer already exist!", chk_already_answer);
            } else {
                const save_answer = await answer.create({
                    questionId: req.body.questionId,
                    answer: req.body.answer,
                    userId: req.user._id,
                });

                return helper.success(res, "Answer saved successfully", save_answer);
            }

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    report: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                reportTo: 'required',
                description: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            const save_report = await report.create({
                reportTo: req.body.reportTo,
                description: req.body.description,
                reportBy: req.user._id,
            });

            return helper.success(res, "Report saved successfully", save_report);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    blockUnblock: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                blockedTo: 'required',
            });

            let errorsResponse = await helper.checkValidation(v)
            if (errorsResponse) {
                return await helper.failed(res, errorsResponse)
            }
            var chk_exist_data = await block.findOne({
                blockedTo: req.body.blockedTo,
                blockedBy: req.user._id,
            });
            var msg = "";
            if (chk_exist_data) {
                await block.findByIdAndDelete({ _id: chk_exist_data._id });
                msg = "Unblock successfully";
            } else {
                await block.create({
                    blockedTo: req.body.blockedTo,
                    blockedBy: req.user._id,
                });
                msg = "Block successfully";
            }

            return helper.success(res, msg);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
    blockList: async (req, res) => {
        try {
            var block_list = await block.find({
                blockedBy: req.user._id,
            }).populate("blockedTo");

            return helper.success(res, "Block list fetch successfully", block_list);

        } catch (error) {
            return helper.failed(res, error);
        }
    },
}








