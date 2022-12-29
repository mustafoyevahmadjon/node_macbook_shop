const { Router } = require("express");
const Order = require("../models/orders");
const auth = require("../middleware/auth");
const router = Router();

router.get("/",auth, async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId"
    );
    res.render("orders", {
      isOrder: true,
      title: "Orders",
      orders: orders.map((a) => ({
        ...a._doc,
        price: a.notebooks.reduce((total, c) => {
          return (total += c.count * c.notebook.price);
        }, 0),
      })),
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.notebookId");
    const notebooks = user.cart.items.map((a) => ({
      count: a.count,
      notebook: { ...a.notebookId._doc },
    }));
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      notebooks,
    });
    await order.save();
    await req.user.cleanCart();
    res.render("orders");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
