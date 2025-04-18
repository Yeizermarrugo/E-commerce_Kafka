const router = require("express").Router();
const jwt = require("jsonwebtoken");
const authService = require("./auth.http");
const config = require("../../config").api;

router.post("/login", authService.login);
router.post("/register", authService.signUp);

module.exports = { router };
