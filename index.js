const express = require("express")

const cors = require("cors")

const logger = require("./helpers/winston/index")
const userRouter = require("./routers/user")

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/v1/user", userRouter)

app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server started on port ${process.env.PORT || 3000}`)
  logger.info("http://localhost:3000/")
})
