const helper = require("../helper/helper");

const news = require("../models/news");

module.exports = {

  newsList: async (req, res) => {
    try {
        const title = "News List";
        if (!req.session.user) return res.redirect("/admin/login");
        const result = await news.find().sort({ createdAt: "desc" });
        res.render("dashboard/news/list", {result,title,msg:req.flash("msg")});
    } catch (error) {
      console.log(error);
    }
  },
  getFormNews: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      let title = "News List";
      res.render("dashboard/news/addnews",{title});
    
    } catch (error) {
      console.log(error);
    }
  },
  addNews: async (req, res) => {
    try {
      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          image = helper.fileUpload(image, "news");
        }
      }
      const user = await news.create({
        title: req.body.title,
        image: image,
        description: req.body.description,
      });
      res.redirect("/admin/news");

    } catch (error) {
      console.log(error);
    }
  },
  status: async (req, res) => {
    try {
      const id = req.body.id;
      const user = await news.findByIdAndUpdate(
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
  newsViews: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const id = req.params.id;
      const title = "News List";
      const newsDetails = await news.findById({ _id: id });

      res.render("dashboard/news/view",{title,newsDetails});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  newsEdit: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const id = req.params.id;
      const title = "News List";
      const newsDetails = await news.findById({ _id: id });

      res.render("dashboard/news/editNews",{title,newsDetails});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  updateNews: async (req, res) => {
    try {
      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          image = helper.fileUpload(image, "news");
        }
      }
      const user = await news.findByIdAndUpdate({
        _id: req.body.id },
        {
        title: req.body.title,
        image: image?image:req.body.old_img,
        description: req.body.description,
      });
      res.redirect("/admin/news");

    } catch (error) {
      console.log(error);
    }
  },
  deleteNews: async (req, res) => {
    try {
      console.log(req.body);
      const update = await news.deleteOne({ _id: req.body.id });

      if (update) {
        console.log("ok", "//////////////////////////////////////");
        res.json(1);
      } else {
        console.log("okfdssa", "//////////////////////////////////////");
        res.json(0);
      }

      //   res.redirect("/admin/categories");
    } catch (error) {
      console.log(error);
    }
  },
};
