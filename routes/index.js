const express = require("express");
const AuthControlllers = require("../controllers/auth.controllers");

const router = express.Router();

router.post("/auth/register", AuthControlllers.signup);

module.exports = router;
