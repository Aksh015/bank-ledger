const mongoose = require("mongoose")

function connectToDB() {
    const mongoUrl = process.env.MONGO_URL

    if (!mongoUrl) {
        console.error("MONGO_URL is missing")
        process.exit(1)
    }

    mongoose.connect(mongoUrl)
        .then(() => {
            console.log("server is connected to DB")
        })
        .catch(err => {
            console.log("Error connecting to DB", err)
            process.exit(1)//stop the server
        })
}
module.exports = connectToDB