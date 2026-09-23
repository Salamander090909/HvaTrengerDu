const express = require('express');
const argon2 = require('argon2');
const mongoose = require('mongoose')
const session = require('express-session');

const app = express();
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"));

app.use(session({
    secret: "3115fdfc7d7be0638a9cc792716ca32f812f849663ff6c011b86cf432f9e48f2",
    resave: false,
    saveUninitialized: false
}));

const mongodb = mongoose.connect("mongodb+srv://Salamander09:MAdWoRWLW87O7cMg@cluster0.9ajv5sh.mongodb.net/?appName=Cluster0")

const Forslag = require('./models/Forslag');
const User = require("./models/User")

app.get("/login",(req, res) => {
    res.render("login")
})

app.get("/registrer",(req, res) => {
    res.render("registrer")
})

app.get("/", async (req, res) => {
    const alleForslag = await Forslag.find()
        .sort({ dato: -1 })
        .populate("bruker", "alder kjønn");
    res.render("index", { alleForslag });
});

app.post("/login", async (req, res) => {
    const { email, passord } = req.body;

    const bruker = await User.findOne({ epost: email });
    if (!bruker) {
        return res.send("Feil e-post eller passord");
    }

    const riktigPassord = await argon2.verify(bruker.passord, passord);
    if (!riktigPassord) {
        return res.send("Feil e-post eller passord");
    }

    req.session.userId = bruker._id;

    res.redirect("/");
});

app.post("/registrer", async (req, res) => {
    const {email, passord, gjentaPassord, alder, kjønn} = req.body;

    if(passord !== gjentaPassord) {
        res.send("passord og gjenta passord stemmer ikke overens")
     } else {

        const hash = await argon2.hash(passord);

        const user = await User.insertOne({
            epost: email,
            passord: hash,
            alder,
            kjønn
        })

        console.log(user);

        res.redirect("/login")
    }
})

app.post("/", async (req, res) => {
    const nyttForslag = new Forslag({ 
        tekst: req.body.forslag,
        bruker: req.session.userId
    });
    await nyttForslag.save();
    res.redirect('/');
});

app.listen(4000, () => {
    console.log("http://localhost:4000")
}); //vi kjører appen på port 4000
