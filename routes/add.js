const { Router } = require("express");
const { validationResult } = require("express-validator");
const Notebook = require("../models/notebook");
const auth = require("../middleware/auth");
const { notebookValidators } = require("../utils/validator");
const router = Router();

router.get("/", auth, (req, res) => {
  res.render("add", { title: "Add Notebook", isAdd: true });
});

router.post("/", auth, notebookValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("add", {
      title: "Add Notebook",
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        descr: req.body.descr,
      },
    });
  }
  const notebook = new Notebook({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    descr: req.body.descr,
    userId: req.user._id,
  });
  try {
    await notebook.save();
    res.redirect("/notebooks");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
