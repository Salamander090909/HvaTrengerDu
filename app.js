const express = require('express');
const argon2 = require('argon2');
const mongoose = require('mongoose')
const dotenv = require("dotenv").config();
const session = require('express-session');
 
const app = express();
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"));
 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

 
const { blokkerBanneord } = require("./utils/banneord");

const mongodb = mongoose.connect(process.env.MONGO_URI, { dbName: "hvatrengerdu" });

const Forslag = require('./models/Forslag');
const User = require("./models/User")

async function requireAdmin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    const bruker = await User.findById(req.session.userId);
    if (!bruker || bruker.epost?.trim().toLowerCase() !== "monhelle@gmail.com") {
        return res.status(403).send("Du har ikke tilgang til denne siden.");
    }

    next();
}

app.get("/admin", requireAdmin, async (req, res) => {
    const alleForslag = await Forslag.find({ "kommentarer.0": { $exists: true } })
        .sort({ dato: -1 })
        .populate("kommentarer.bruker", "alder kjønn");

    res.render("admin", { alleForslag });
});

app.post("/admin/comments/:forslagId/:kommentarId/delete", requireAdmin, async (req, res) => {
    const { forslagId, kommentarId } = req.params;
    if (!mongoose.isValidObjectId(forslagId) || !mongoose.isValidObjectId(kommentarId)) {
        return res.status(404).send("Kommentaren ble ikke funnet.");
    }

    const resultat = await Forslag.updateOne(
        { _id: forslagId, "kommentarer._id": kommentarId },
        { $pull: { kommentarer: { _id: kommentarId } } }
    );

    if (resultat.matchedCount === 0) {
        return res.status(404).send("Kommentaren ble ikke funnet.");
    }

    res.redirect("/admin");
});
 
app.get("/login",(req, res) => {
    res.render("login")
})
 
app.get("/registrer",(req, res) => {
    res.render("registrer")
})

app.get("/", async (req, res) => {
    const alleForslag = await Forslag.find()
        .sort({ dato: -1 })
        .populate("bruker", "alder kjønn")
        .populate("kommentarer.bruker", "alder kjønn");
    res.render("index", { alleForslag });
});

app.post("/kommenter/:id", blokkerBanneord("kommentarTekst"), async (req, res) => {
    await Forslag.updateOne(
        { _id: req.params.id },
        { $push: { kommentarer: {
            tekst: req.body.kommentarTekst,
            bruker: req.session.userId
        } } }
    );
    res.redirect('/');
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
 
app.post("/", blokkerBanneord("forslag"), async (req, res) => {
    const nyttForslag = new Forslag({ 
        tekst: req.body.forslag,
        bruker: req.session.userId
    });
    await nyttForslag.save();
    res.redirect('/');
});


app.post("/like", async (req, res) => {
    const { like } = req.body;
    const forslag = await Forslag.findById(like);
    const brukerId = req.session.userId || req.sessionID;

    let count = forslag.numberLikes || 0;

    if (forslag.likes.includes(brukerId)) {
        forslag.likes.pull(brukerId);
        forslag.numberLikes = count - 1;
    } else {
        forslag.likes.push(brukerId);
        forslag.numberLikes = count + 1;
    }

    await forslag.save();
    res.status(200).redirect("/");
});


 
app.listen(4000, () => {
    console.log("http://localhost:4000")
}); //vi kjører appen på port 4000