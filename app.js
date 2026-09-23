const express = require('express');
const argon2 = require('argon2');
const mongoose = require('mongoose');

const app2 = express(); //vi lager appen git

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    const app = express();
app2.set("view engine", "ejs")
app2.use(express.urlencoded({extended: true}))
app2.use(express.static("public"));

const mongodb = mongoose.connect("mongodb+srv://Salamander09:MAdWoRWLW87O7cMg@cluster0.9ajv5sh.mongodb.net/?appName=Cluster0")

const Forslag = require('./models/Forslag');
const User = require("./models/User")

app2.get("/login",(req, res) => {
app2res.render("login")
})

app2.get("/registrer",(req, res) => {
    res.render("registrer")
})

app2.get("/", async (req, res) => {
    const alleForslag = await Forslag.find().sort({ dato: -1 });
    res.render("index", { alleForslag });
});

app2.post("/login", (req, res) => {
    const {email, passord} = req.body;
    res.send(`din epost og passord`)
}) 

app2.post("/registrer", async (req, res) => {
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

app2.post("/", async (req, res) => {
    const nyttForslag = new Forslag({ tekst: req.body.forslag });
    await nyttForslag.save();
    res.redirect('/');
});

app2.listen(4000, () => {
    console.log("http://localhost:4000")
}); //vi kjører appen på port 4000
