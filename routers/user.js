const express = require("express")
const router = express.Router()

const userAuthController = require("../controllers/userAuthController")
const AuthenticationControllerPolicy = require("../policies/AuthenticationControllerPolicy")

// router.get("/status", userAuthController.status)
// router.get("/register", userAuthController.index)
router.post(
  "/login",
  AuthenticationControllerPolicy.register,
  userAuthController.index
)
router.post(
  "/register",
  AuthenticationControllerPolicy.register,
  userAuthController.store
)

module.exports = router
