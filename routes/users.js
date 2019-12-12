var express = require("express");
require("../src/mongod/connect");
const auth = require("../src/middlewares/auth");
const User = require("../src/models/users");
var router = express.Router();
const Transaction = require("../src/models/transaction");

router.post("/", async (req, res, next) => {
  const user = new User(req.body);
  try {
    const data = await user.save();
    const token = await user.generateAuthToken();
    const trans = new Transaction({
      balance: 0,
      owner: data._id
    });
    await trans.save();
    res.status(201).send({ data, token });
  } catch (error) {
    res.status(401).send(error + "");
  }
});

router.post("/login", async (req, res, next) => {
  console.log("4");

  try {
    const user = await User.checkCradentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error + "");
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(tok => tok.token !== req.token);
    await req.user.save();
    res.status(200).send("");
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
