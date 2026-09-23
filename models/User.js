const { hash } = require("argon2")
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema( {
    epost: String,
<<<<<<< HEAD
    passord: String
=======
    passord: String,
    alder: Number,
    kjønn: String
>>>>>>> 65d0f079e56452c9ff26d0c0c72a1422e831a2ab

})

module.exports = mongoose.model("User", userSchema)