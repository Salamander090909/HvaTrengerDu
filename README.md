# HvaTrengerDu

En liten nettside hvor elever kan gi skolen innspill og forslag til hva som kan gjøre skolemiljøet og skolehverdagen bedre.
 
Forsiden stiller spørsmålet:
 
En nettside hvor elever kan sende inn forslag til hva som kan gjøre skolehverdagen bedre.
 
## Hva du trenger
 
- [Node.js](https://nodejs.org/) (versjon 18 eller nyere)
- Tilgang til MongoDB-databasen
## Installasjon
 
1. Klon prosjektet:
```bash
   git clone <repo-url>
   cd HvaTrengerDu
```
 
2. Installer avhengigheter:
```bash
   npm install
```
 
3. Opprett en fil som heter `.env` i rotmappen, og lim inn:
```
   MONGODB_URI=<tilkoblingsstreng til databasen>
```
 
4. Start serveren:
```bash
   node app.js
```
 
5. Åpne nettleseren på:
```
   http://localhost:4000
```
