const { where } = require("sequelize")
const db = require("../models")
// const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const config = require("../config/่jwt/config.js")

const jwtSignUser = (user) => {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK,
  })
}

module.exports = {
  status: (req, res) => {
    return res.json({ message: "User Auth Controller is working." })
  },
  index: async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await db.User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({ message: "User not found." })
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password)
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Password is incorrect." })
      }
      const token = user.token
      return res.status(200).json({
        message: "Login success.",
        token: token,
      })
    } catch (error) {
      return res.status(500).json({ message: "Cannot login.", error: error })
    }
  },
  me: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1]
      const user = await db.User.findOne({ where: { token: token } })
      return res.json(user)
    } catch (error) {
      console.error("Error while fetching user:", error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  },
  list: async (req, res) => {
    try {
      const user = await db.User.findAll()
      return res.json(user)
    } catch (e) {
      return res.status(500).json({ message: "Cannot get data from database." })
    }
  },
  store: async (req, res) => {
    const { email, password, role, permission } = req.body
    if (!req.body || !email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password R P are required." })
    }
    try {
      const hashPassword = await bcrypt.hash(password, 10)
      const role = "admin"
      const permission = ["view", "edit", "delete"]
      const user = {
        // id: uuidv4(),
        email: email,
        password: hashPassword,
        role: role,
        permission: permission,
      }
      const token = jwtSignUser({ email: user.email })
      user.token = token
      const data = await db.User.create(user)
      return res.status(201).json(data)
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Cannot create user to database." })
    }
  },
  update: async (req, res) => {
    const id = req.params.id
    const data = req.body
    if (id && data) {
      await db.sequelize.transaction((t) => {
        return db.User.update(data, { where: { id: id } }, { transaction: t })
      })
      return res.status(200).json({ message: "Data has been updated.", data })
    }
    return res.status(400).json({ message: "Bad request." })
  },
  destroy: async (req, res) => {
    const id = req.params.id
    if (id) {
      try {
        await db.User.destroy({ where: { id: id } })
        return res.status(204).json({ message: "Data has been removed." })
      } catch (e) {
        return res
          .status(500)
          .json({ message: "Cannot remove data from database." })
      }
    } else {
      return res.status(400).json({ message: "Bad request." })
    }
  },
}
