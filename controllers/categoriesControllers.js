const helper = require("../helper/helper");

const categories = require("../models/categories");
// const subCategories = require("../models/subCategories");

module.exports = {
  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{   Category  Start  }}}}}}}}}}}}}}}}}}}}}}}}}}}}

  categories: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      var mysort = { createdAt: -1 };

      const category = await categories.find().sort(mysort);
      let title = "categories";
      res.render("dashboard/category/categoryList", { category, title });
    } catch (error) {
      console.log(error);
    }
  },

  addCategory: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      let title = "addCategory";
      res.render("dashboard/category/addCategoryPage", { title });
    } catch (error) {
      console.log(error);
    }
  },

  postCategory: async (req, res) => {
    try {
      await categories.create({
        title: req.body.name,
        status: req.body.status,
      });
      res.redirect("/admin/categories");
    } catch (error) {
      console.log(error);
    }
  },

  getUpdateCategory: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const categoryInfo = await categories.findById({ _id: req.params.id });
      let title = "UpdateCategory";

      res.render("dashboard/category/editCategoryPage", {
        categoryInfo,
        title,
      });
    } catch (error) {
      console.log(error);
    }
  },

  updateCategory: async (req, res) => {
    try {
      await categories.findByIdAndUpdate(
        { _id: req.body._id },
        { title: req.body.title, status: req.body.status }
      );
      res.redirect("/admin/categories");
    } catch (error) {
      console.log(error);
    }
  },

  categoryStatus: async (req, res) => {
    try {
      let update = await categories.findByIdAndUpdate(
        {
          _id: req.body.id,
        },
        {
          status: req.body.status,
        }
      );
      if (update) {
        res.json(1);
      } else {
        res.json(0);
      }
    } catch (error) {
      console.log(error);
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const update = await categories.deleteOne({ _id: req.body.id });

      if (update) {
        // console.log("ok", "//////////////////////////////////////");
        res.json(1);
      } else {
        // console.log("okfdssa", "//////////////////////////////////////");
        res.json(0);
      }

      //   res.redirect("/admin/categories");
    } catch (error) {
      console.log(error);
    }
  },
  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{   Category  End  }}}}}}}}}}}}}}}}}}}}}}}}}}}}

  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{   Sub Category  Start  }}}}}}}}}}}}}}}}}}}}}}}}}}}}

  //   subCategories: async (req, res) => {
  //     try {
  //       var mysort = { createdAt: -1 };
  //       const subCategory = await subCategories
  //         .find()
  //         .sort(mysort)
  //         .populate("category_id");
  //       console.log(subCategory);
  //       // var subCategory = [];

  //       if (!req.session.user) return res.redirect("/admin/login");
  //       res.render("dashboard/category/subCategoryList", { subCategory });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },

  //   addSubCategory: async (req, res) => {
  //     try {
  //       const categoryInfo = await categories.find();

  //       if (!req.session.user) return res.redirect("/admin/login");
  //       res.render("dashboard/category/addSubCategoryPage", { categoryInfo });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },

  //   postSubCategory: async (req, res) => {
  //     try {
  //       if (req.files && req.files.image) {
  //         var image = req.files.image;
  //         if (image) {
  //           req.body.image = helper.fileUpload(image, "images");
  //         }
  //       }
  //       await subCategories.create({
  //         category_id: req.body.category_id,
  //         name: req.body.name,
  //         image: req.body.image,
  //         status: true,
  //       });

  //       res.redirect("/admin/addStory");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },

  //   editSubCategory: async (req, res) => {
  //     try {
  //       const categoryInfo = await categories.find();

  //       const subCategoryInfo = await subCategories.findById({
  //         _id: req.params.id,
  //       });

  //       console.log(categoryInfo);
  //       if (!req.session.user) return res.redirect("/admin/login");
  //       res.render("dashboard/category/editSubCategoryPage", {
  //         categoryInfo,
  //         subCategoryInfo,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },

  //   postSubCategoryUpdate: async (req, res) => {
  //     try {
  //       if (req.files && req.files.image) {
  //         var image = req.files.image;
  //         if (image) {
  //           req.body.image = helper.fileUpload(image, "images");
  //         }
  //       }
  //       await subCategories.findByIdAndUpdate(
  //         { _id: req.body.id },
  //         {
  //           category_id: req.body.categoryId,
  //           name: req.body.name,
  //           image: req.body.image,
  //         }
  //       );
  //       res.redirect("/admin/subCategories");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   subCategoryStatus: async (req, res) => {
  //     try {
  //       let update = await subCategories.findByIdAndUpdate(
  //         {
  //           _id: req.body.id,
  //         },
  //         {
  //           status: req.body.status,
  //         }
  //       );
  //       if (update) {
  //         res.json(1);
  //       } else {
  //         res.json(0);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },

  //   deletsubCategory: async (req, res) => {
  //     try {
  //       console.log(req.body);
  //       const update = await subCategories.deleteOne({ _id: req.body.id });

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
