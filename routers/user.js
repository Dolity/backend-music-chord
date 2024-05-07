const express = require("express")
const router = express.Router()

const userAuthController = require("../controllers/userAuthController")
const AuthenticationControllerPolicy = require("../policies/AuthenticationControllerPolicy")
const {
  roleAuthenticate,
  permissionAuthenticate,
  verifyToken,
} = require("../middleware/authentication")

router.get("/me", userAuthController.me)
router.get("/status", userAuthController.status)
router.get(
  "/users",

  roleAuthenticate(["admin"]),
  permissionAuthenticate(["view", "edit", "delete"]),
  userAuthController.list
)

router.post(
  "/login",
  AuthenticationControllerPolicy.register,
  userAuthController.index
)
router.post(
  "/register",
  // AuthenticationControllerPolicy.register,
  userAuthController.store
)
router.put("/update/:id", userAuthController.update)
router.delete("/delete/:id", userAuthController.destroy)

module.exports = router
