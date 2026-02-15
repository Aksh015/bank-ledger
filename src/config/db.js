const mongoose = require("mongoose")

function connectToDB() {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("server is connected to DB")
        })
        .catch(err => {
            console.log("Error connecting to DB", err)
            process.exit(1)//stop the server
        })
}
module.exports = connectToDB