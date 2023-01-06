const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth");

const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email", "Invalid Email Address").isEmail().normalizeEmail(),
    body("password", "Password is too short. (Minimum 5 characters)")
      .isLength({
        min: 5,
      })
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    body("email", "Invalid Email Address.")
      .isEmail()
      .normalizeEmail()
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists.");
          }
        });
      }),
    body("password", "Password is too short. (Minimum 5 characters)")
      .isLength({
        min: 5,
      })
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match.");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

module.exports = router;
