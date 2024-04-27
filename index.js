const express = require("express")
const cors = require("cors")

const logger = require("./helpers/winston/index")

const app = express()

app.get("/status", (req, res) => {
  res.send("Hello World!")
})

app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server started on port ${process.env.PORT || 3000}`)
  logger.info("http://localhost:3000/")
})
