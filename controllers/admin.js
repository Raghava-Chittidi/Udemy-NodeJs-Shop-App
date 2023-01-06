const Product = require("../models/product");
const deleteImage = require("../util/deleteImage");

const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isAuthenticated: req.session.isLoggedIn,
    product: { title: "", price: "", description: "" },
    errorMessage: message,
    inputErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: "Attached file is not an image",
      product: { title, price, description },
      inputErrors: [],
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (image) {
      deleteImage(image.filename);
    }

    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors.array()[0].msg,
      product: { title, price, description },
      inputErrors: errors.array(),
    });
  }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: "/" + image.filename,
    userId: req.user,
  });
  product
    .save()
    .then((result) => res.redirect("/admin/products"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getProducts = async (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) =>
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      })
    )
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getEditProduct = async (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        product: product,
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        inputErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postEditProduct = async (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const id = req.body.id;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (image) {
      deleteImage(image.filename);
    }
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors.array()[0].msg,
      product: { title, price, description, _id: id },
      inputErrors: errors.array(),
    });
  }

  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.price = price;
      product.description = description;
      if (image) {
        deleteImage(product.imageUrl);
        product.imageUrl = "/" + image.filename;
      }

      return product.save().then((result) => res.redirect("/admin/products"));
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.deleteProduct = async (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found!"));
      }
      deleteImage(product.imageUrl);
      return Product.deleteOne({ _id: id, userId: req.user._id });
    })
    .then((result) => {
      res.status(200).json({ message: "Success!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to delete product!" });
    });
};
