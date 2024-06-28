const helper = require("../helper/helper");

const report = require("../models/report");

module.exports = {

  report: async (req, res) => {
    try {
        const title = "Report";
        if (!req.session.user) return res.redirect("/admin/login");
        const result = await report.find()
        .populate({
            path : 'reportBy',
            model : 'users',
            select : '_id firstName lastName'
        })
        .populate({
            path : 'reportTo',
            model : 'users',
            select : '_id firstName lastName'
        })
        .sort({ createdAt: "desc" });
        res.render("dashboard/report/list", {result,title,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
//   getFormReward: async (req, res) => {
//     try {
//       if (!req.session.user) return res.redirect("/admin/login");
//       let title = "Reward";
//       res.render("dashboard/reward/add",{title});
    
//     } catch (error) {
//       console.log(error);
//     }
//   },
//   addReward: async (req, res) => {
//     try {
//       if (req.files && req.files.image) {
//         var image = req.files.image;
//         if (image) {
//           image = helper.fileUpload(image, "reward");
//         }
//       }
//       const user = await reward.create({
//         title: req.body.title,
//         image: image,
//         description: req.body.description,
//       });
//       req.flash("msg", "Added successfully");
//       res.redirect("/admin/reward");

//     } catch (error) {
//       console.log(error);
//     }
//   },
// //   status: async (req, res) => {
// //     try {
// //       const id = req.body.id;
// //       const user = await news.findByIdAndUpdate(
// //         { _id: id },
// //         { status: req.body.status }
// //       );
// //       if (user) {
// //         res.json(1);
// //       } else {
// //         res.json(0);
// //       }
// //     } catch (error) {
// //       return res.status(500).send({
// //         message: "Internal Server Error",
// //         error: error.message,
// //       });
// //     }
// //   },
reportView: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const id = req.params.id;
      const title = "Report";
      const reportDetails = await report.findById({ _id: id })
      .populate({
        path : 'reportBy',
        model : 'users',
        select : '_id firstName lastName'
    })
    .populate({
        path : 'reportTo',
        model : 'users',
        select : '_id firstName lastName'
    });

      res.render("dashboard/report/view",{title,reportDetails});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
//   rewardEdit: async (req, res) => {
//     try {
//       if (!req.session.user) return res.redirect("/admin/login");
//       const id = req.params.id;
//       const title = "Reward";
//       const rewardDetails = await reward.findById({ _id: id });

//       res.render("dashboard/reward/edit",{title,rewardDetails});
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   },
//   updateReward: async (req, res) => {
//     try {
//       if (req.files && req.files.image) {
//         var image = req.files.image;
//         if (image) {
//           image = helper.fileUpload(image, "reward");
//         }
//       }
//       const user = await reward.findByIdAndUpdate({
//         _id: req.body.id },
//         {
//         title: req.body.title,
//         image: image?image:req.body.old_img,
//         description: req.body.description,
//       });
//       req.flash("msg", "Updated successfully");
//       res.redirect("/admin/reward");

//     } catch (error) {
//       console.log(error);
//     }
//   },
//   deleteReward: async (req, res) => {
//     try {
//     //   console.log(req.body);
//       const update = await reward.deleteOne({ _id: req.body.id });

//       if (update) {
//         console.log("ok", "//////////////////////////////////////");
//         res.json(1);
//       } else {
//         console.log("okfdssa", "//////////////////////////////////////");
//         res.json(0);
//       }

//       //   res.redirect("/admin/categories");
//     } catch (error) {
//       console.log(error);
//     }
//   },
};
