const { body } = require("express-validator");
const User = require("../models/user");
exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Enter Yout Email correctly")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("This Email Is Already exist");
        }
      } catch (error) {
        console.log(error);
      }
    }),
  body("password", "Password should be min 6 symbols")
    .isLength({
      min: 6,
      max: 56,
    })
    .isAlphanumeric()
    .trim(),

  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password should be similar");
      }
      return true;
    })
    .trim(),
  body("name", "name should be min 3 symbols").isLength({ min: 3 }).trim(),
  // .withMessage("name should be min 3 symbols"),
];

exports.notebookValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Min Length for title should be 3 symbols")
    .trim(),
  body("price").isNumeric().withMessage("Write Correct Price"),
  body("img").isURL().whitelist("Write correct URL Image"),
  body("descr")
    .isLength({ min: 10 })
    .withMessage("Description Should Be Min 10 Symbols"),
];
