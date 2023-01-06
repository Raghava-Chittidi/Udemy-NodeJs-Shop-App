const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");
const { body } = require("express-validator");

const router = express.Router();

router.use(isAuth);

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/products => GET
router.get("/products", adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title", "Invalid Title.").isString().isLength({ min: 3 }).trim(),
    body("price", "Invalid Price.").isFloat(),
    body("description", "Invalid Description.").isLength({ min: 5 }).trim(),
  ],
  adminController.postAddProduct
);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title", "Invalid Title.").isString().isLength({ min: 3 }).trim(),
    body("price", "Invalid Price.").isFloat(),
    body("description", "Invalid Description.").isLength({ min: 5 }).trim(),
  ],
  adminController.postEditProduct
);

router.delete("/products/:productId", adminController.deleteProduct);

module.exports = router;
