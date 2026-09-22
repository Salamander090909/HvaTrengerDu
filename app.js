const express = require('express');
const argon2 = require('argon2');
const mongoose = require('mongoose')

const app = express();
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"));

const mongodb = mongoose.connect("mongodb://localhost:27017/HvaTrengerDu")

const Forslag = require('./models/Forslag');

app.get("/login",(req, res) => {
    res.render("login")
})

app.get("/registrer",(req, res) => {
    res.render("registrer")
})

app.get("/", async (req, res) => {
    const alleForslag = await Forslag.find().sort({ dato: -1 });
    res.render("index", { alleForslag });
});

app.post("/login", (req, res) => {
    const {email, passord} = req.body;
    res.send(`din epost og passord`)
}) 

app.post("/registrer", async (req, res) => {
    const {email, passord, gjentaPassord} = req.body;
    if(passord !== gjentaPassord) {
        res.send("passord og gjenta passord stemmer ikke overens")
     } else {

        const hash = await argon2.hash(passord);

        const user = User.insertOne({
            email, 
            passord: hash
        })

        console.log(user);

        console.log(hash);

        res.redirect("/login")
    }
})

app.post("/", async (req, res) => {
    const nyttForslag = new Forslag({ tekst: req.body.forslag });
    await nyttForslag.save();
    res.redirect('/');
});



app.listen(4000, () => {
    console.log("http://localhost:4000")
}); //vi kjører appen på port 4000
