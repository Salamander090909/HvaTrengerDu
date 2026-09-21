const express = require('express'); //importert express
const argon2 = require('argon2');

const app = express(); //vi lager appen

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("index");
})







app.listen(4000, () => {
    console.log("http://localhost:4000")
}); //vi kjører appen på port 4000