var express = require("express");
const Transaction = require("../src/models/transaction");
var router = express.Router();
const Cars = require("../src/models/users");
const auth = require("../src/middlewares/auth");

router.get("/", auth, async function(req, res, next) {
  const match = {};
  const sort = {};

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split("_");
    sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
  }

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  try {
    const data = await Transaction.find({ owner: req.user._id });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/:ope", auth, async (req, res, next) => {
  operation = req.params.ope;
  const data = await Transaction.find({ owner: req.user._id })
    .sort({
      createdAt: -1
    })
    .limit(1);

  data[0].balance = await eval(data[0].balance + operation + req.body.balance);

  try {
    const newvalue = await data[0].save();
    res.status(201).send(newvalue);
  } catch (error) {
    res.status(400).send(error);
  }
});

// router.patch("/:id", async (req, res, next) => {
//   const updates = Object.keys(req.body);
//   try {
//     const car = await Cars.findById(req.params.id);

//     if (!car) return res.status(404).send();
//     updates.forEach(update => (car[update] = req.body[update]));
//     data = await car.save();
//     res.send(data);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

module.exports = router;
