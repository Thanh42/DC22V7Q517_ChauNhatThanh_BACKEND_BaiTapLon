const express = require("express");
const users = require("../controllers/auth.controller");

const router = express.Router();

router.route("/login").post(users.authenticate);
router.route("/register").post(users.register);

module.exports = router;
