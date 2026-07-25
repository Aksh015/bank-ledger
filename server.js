require("dotenv").config()

const app = require("./src/app")
const connectToDB = require("./src/config/db")

connectToDB()

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

function shutdown(signal) {
    console.log(`${signal} received, shutting down gracefully`)
    server.close(() => {
        process.exit(0)
    })
}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT", () => shutdown("SIGINT"))