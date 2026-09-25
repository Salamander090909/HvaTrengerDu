// utils/banneord.js

// ───────────── PREFIKS: blokkerer ord som BEGYNNER med disse ─────────────
const banneord = [
  // norske banneord
  "faen", "fanden", "jævel", "jævla", "jævlig", "helvete", "hælvete",
  "satan", "dritt", "føkk", "møkkamann",

  // kropp og seksuelt
  "fitte", "kuk", "pikk", "pule", "rasshøl", "rasshol", "ræva", "rævpuler",
  "hestkuk", "kødd",

  // nedsettende om kvinner
  "hore", "horunge", "ludder", "tispe", "hurpe",

  // rasistiske
  "svarting", "svartskalle", "paki", "blatte", "jødesvin",

  // homofobe og transfobe
  "homse", "soper", "tranny", "shemale",

  // funksjonshemming
  "mongo", "mongis", "retard", "tilbakestående", "evneveik", "spaz",

  // milde skjellsord (fjern hvis du synes de er ok)
  "idiot", "tulling", "hønsehjerne",

  // engelske
  "fuck", "motherfucker", "shit", "bitch", "cunt", "dick", "asshole",
  "bastard", "whore", "slutty", "skank", "twat", "wanker", "prick",
  "pussy", "cocksucker", "faggot", "chink", "gook", "beaner",
  "wetback", "raghead", "towelhead",
];

// ───────────── EKSAKT: blokkerer bare hvis HELE ordet er likt ─────────────
const eksakteOrd = [
  "homo", "transe", "dyke", "kike", "spic", "hoe", "cock",
];

// ─────── HVOR SOM HELST: blokkerer hvis ordet finnes INNI et annet ord ───────
const hvorSomHelst = [
  "neger", "negre", "nigger", "nigga",
];

// ──────── TILLATT: ord som BEGYNNER med dette er alltid ok ────────
const tillatteOrd = [
  "pikkolo", "pike", "pikant", "piknik", "piksel", "kukeleku", "horisont",
  "mongodb", "mongolia", "mongolsk", "mongoler", "pakistan", "nigeria",
];

// Tall og tegn som ofte brukes for å lure filteret (f4en, sh1t, @sshole)
const leet = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", "@": "a", $: "s", "!": "i" };

function normaliser(tekst) {
  return tekst
    .toLowerCase()
    .split("")
    .map((tegn) => leet[tegn] || tegn)
    .join("")
    .replace(/(.)\1+/g, "$1"); // "faaaaen" -> "faen", "dritt" -> "drit"
}

const prefiks = banneord.map(normaliser);
const eksakte = eksakteOrd.map(normaliser);
const overalt = hvorSomHelst.map(normaliser);
const tillatte = tillatteOrd.map(normaliser);

function erBanneord(ord) {
  if (tillatte.some((t) => ord.startsWith(t))) return false;
  if (eksakte.includes(ord)) return true;
  if (overalt.some((b) => ord.includes(b))) return true;
  return prefiks.some((b) => ord.startsWith(b));
}

function inneholderBanneord(tekst = "") {
  const ord = normaliser(String(tekst)).split(/[^a-zæøå]+/).filter(Boolean);
  return ord.some(erBanneord);
}

// Middleware: sjekker feltene du oppgir i req.body
function blokkerBanneord(...felter) {
  return (req, res, next) => {
    const funnet = felter.some((felt) => inneholderBanneord(req.body[felt]));
    if (funnet) return res.redirect("/?feil=banneord");
    next();
  };
}

module.exports = { inneholderBanneord, blokkerBanneord };