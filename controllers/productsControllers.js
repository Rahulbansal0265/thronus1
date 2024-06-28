const helper = require("../helper/helper");

const products = require("../models/products");
// const subproducts = require("../models/subproducts");

module.exports = {
  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{   product  Start  }}}}}}}}}}}}}}}}}}}}}}}}}}}}

  products: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      var mysort = { createdAt: -1 };

      const product = await products.find().sort(mysort);
      let title = "products";
      let type = "admin";
      res.render("dashboard/product/productList", { product, title, type });
    } catch (error) {
      console.log(error);
    }
  },

  addProduct: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      let title = "addProduct";
      let type = "admin";
      res.render("dashboard/product/addProductPage", { title, type });
    } catch (error) {
      console.log(error);
    }
  },

  postProduct: async (req, res) => {
    try {
      // console.log(req.files,">>>>");
      // return
      let {
        produto,
        cbd_mg,
        thc_mg,
        total_cbd,
        total_thc,
        investimento,
      } = req.body;

      if (req.files && req.files.image) {
        var images = req.files.image; 
            if (Array.isArray(images)) {
            var uploadedImages = [];
                for (var i = 0; i < images.length; i++) {
                var image = images[i];
                    if (image) {
                    var imagePath = helper.fileUpload(image, "products");
                    uploadedImages.push(imagePath);
                }
            }
        } else {
            var image = images;
            if (image) {
                var uploadedImages = helper.fileUpload(image, "products");
                // uploadedImages.push(imagePath)
            }
        }
    }
    
      await products.create({
        produto,
        cbd_mg,
        thc_mg,
        total_cbd,
        total_thc,
        investimento,
        image:uploadedImages
      });
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
    }
  },

  getProduct: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const data = await products.findById({ _id: req.params.id });
      let title = "Update Product";
      res.render("dashboard/product/productView",{title,data});
    } catch (error) {
      console.log(error);
    }
  },
  getUpdateProduct: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/admin/login");
      const data = await products.findById({ _id: req.params.id });
      let title = "Update Product";
      let type = "admin";
      res.render("dashboard/product/editProductPage", {
        data,
        title,
        type,
      });
    } catch (error) {
      console.log(error);
    }
  },

  updateProduct: async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/admin/login");

        let {
          produto,
          cbd_mg,
          thc_mg,
          total_cbd,
          total_thc,
          investimento,
          id,
        } = req.body;
//         console.log(req.body,">>>>>>>>>>>>>>body");
//         console.log(req.files,">>>>>>>>>>>>>>files");
// return

        if (req.files && req.files.image) {
            var images = req.files.image;
            var uploadedImages 

            if (Array.isArray(images)) {
                for (var i = 0; i < images.length; i++) {
                    var image = images[i];
                    if (image) {
                        var uploadedImages = helper.fileUpload(image, "products");
                        // uploadedImages.push(imagePath);
                    }
                }
            } else {
                var image = images;
                if (image) {
                    var uploadedImages = helper.fileUpload(image, "products");
                    // uploadedImages.push(imagePath);
                }
            }

            // let product = await products.findById(id);
            // let oldImages = product.image;

            // let updatedImages = oldImages.concat(uploadedImages);

            await products.findByIdAndUpdate(
                { _id: id },
                {
                  produto,
                  cbd_mg,
                  thc_mg,
                  total_cbd,
                  total_thc,
                  investimento,
                  image: uploadedImages,
                }
            );
        } else {
            await products.findByIdAndUpdate(
                { _id: id },
                {
                  produto,
                  cbd_mg,
                  thc_mg,
                  total_cbd,
                  total_thc,
                  investimento,
                }
            );
        }

        res.redirect("/admin/products");
    } catch (error) {
        console.log(error);
    }
},

  productStatus: async (req, res) => {
    try {
      let update = await products.findByIdAndUpdate(
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

  deleteProduct: async (req, res) => {
    try {
      // console.log(req.body);
      const update = await products.deleteOne({ _id: req.body.id });

      if (update) {
        console.log("ok", "//////////////////////////////////////");
        res.json(1);
      } else {
        console.log("okfdssa", "//////////////////////////////////////");
        res.json(0);
      }

      //   res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
    }
  },
  deleteProductImg: async (req, res) => {
    try {
      products.updateOne(
        { _id: req.body.id }, 
        { $pull: { image: req.body.imageName } },
        (err, result) => {
          if (err) {
            console.error("Error deleting image:", err);
            res.json(0);
          } else {
            console.log("Image deleted successfully:", result);
            res.json(1);
          }
        }
      );
      
    } catch (error) {
      console.log(error);
    }
  },
};
