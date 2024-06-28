const helper = require("../../helper/helper");

const products = require("../../models/products");
// const subproducts = require("../../models/subproducts");

module.exports = {
  // {{{{{{{{{{{{{{{{{{{{{{{{{{{{   product  Start  }}}}}}}}}}}}}}}}}}}}}}}}}}}}

  products: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      var mysort = { createdAt: -1 };

      const product = await products.find().sort(mysort);
      let title = "products";
      let type = "doctor";
      res.render("subadmin/product/productList", {
        product,
        title,
        type,
        layout: "layout/layout2",
      });
    } catch (error) {
      console.log(error);
    }
  },

  addProduct: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      let title = "addProduct";
      let type = "doctor";
      res.render("dashboard/product/addProductPage", {
        title,
        type,
        layout: "layout/layout2",
      });
    } catch (error) {
      console.log(error);
    }
  },

  postProduct: async (req, res) => {
    try {
      let {
        title,
        manufacturer,
        saltComposition,
        saltSynonymus,
        storage,
        description,
      } = req.body;

      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          image = helper.fileUpload(image, "products");
        }
      }
      await products.create({
        title,
        manufacturer,
        saltComposition,
        saltSynonymus,
        storage,
        description,
        image,
      });
      res.redirect("/admin/products");
    } catch (error) {
      console.log(error);
    }
  },

  getProduct: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      const data = await products.findById({ _id: req.params.id });
      let title = "products";
      res.render("subadmin/product/productView",{title,data,layout: "layout/layout2",});
    } catch (error) {
      console.log(error);
    }
  },
  getUpdateProduct: async (req, res) => {
    try {
      if (!req.session.user) return res.redirect("/subadmin/login");
      const data = await products.findById({ _id: req.params.id });
      let title = "Update Product";
      let type = "doctor";
      res.render("dashboard/product/editProductPage", {
        data,
        title,
        type,
        layout: "layout/layout2",
      });
    } catch (error) {
      console.log(error);
    }
  },

  updateProduct: async (req, res) => {
    try {
      let {
        title,
        manufacturer,
        saltComposition,
        saltSynonymus,
        storage,
        description,
        id,
      } = req.body;

      if (req.files && req.files.image) {
        var image = req.files.image;
        if (image) {
          image = helper.fileUpload(image, "products");
        }
      }
      await products.findByIdAndUpdate(
        { _id: id },
        {
          title,
          manufacturer,
          saltComposition,
          saltSynonymus,
          storage,
          description,
          image,
        }
      );
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
      console.log(req.body);
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
};
