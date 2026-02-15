const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cookieParser())

// all routes 
const authRouter = require("./routes/auth.routes")
app.use("/api/auth",authRouter)





app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})

module.exports = app