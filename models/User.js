const { hash } = require("argon2")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema( {
    epost: String,
    passord: String

})

module.exports = mongoose.model("User", userSchema)