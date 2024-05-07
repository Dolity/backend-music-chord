const jwt = require("jsonwebtoken")
const config = require("../config/่jwt/config.js")
const db = require("../models")

const roleAuthenticate = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"]
      const token = authHeader && authHeader.split(" ")[1]
      if (!token) {
        return res.status(403).send({ message: "No token provided!" })
      }
      const decoded = jwt.verify(token, config.authentication.jwtSecret)

      const user = await db.User.findOne({ where: { email: decoded.email } })
      if (!user) {
        return res.status(401).send({ message: "User not found!" })
      }
      req.userRole = user.role

      if (!requiredRoles.includes(req.userRole)) {
        return res
          .status(401)
          .send({ message: "Requires higher privileges of role!" })
      }

      next()
    } catch (error) {
      console.error("Error in roleAuthenticate middleware:", error)
      if (error.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token has expired" })
      }
      res.status(401).send({ message: "Unauthorized!" })
    }
  }
}

const permissionAuthenticate = (permissions) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"]
      const token = authHeader && authHeader.split(" ")[1]
      if (!token) {
        return res.status(403).send({ message: "No token provided!" })
      }
      const decoded = jwt.verify(token, config.authentication.jwtSecret)
      const user = await db.User.findOne({ where: { email: decoded.email } })
      if (!user) {
        return res.status(401).send({ message: "User not found!" })
      }

      if (!user.permission) {
        return res.sendStatus(403)
      }

      const userPermissions = JSON.parse(user.permission) // change for check value from parameter
      const hasRequiredPermission = permissions.every((p) =>
        userPermissions.includes(p)
      )
      if (hasRequiredPermission) {
        next()
      } else {
        return res
          .status(403)
          .send({ message: "Requires higher privileges of permission!" })
      }
    } catch (error) {
      console.error("Error in roleAuthenticate middleware:", error)
      if (error.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token has expired" })
      }
      res.status(401).send({ message: "Unauthorized!" })
    }
  }
}

module.exports = { roleAuthenticate, permissionAuthenticate }
