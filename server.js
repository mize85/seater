const express = require('express');
const {engine} = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const {assignTables, getRoomsLookup, readNotes, getReservations, availableTables} = require('./data');

// Funktion um die Ordner im 'public' Verzeichnis zu lesen
const checkDataDirectories = () => {
  const dataDir = path.join(__dirname, 'public', 'data');
  return new Promise((resolve, reject) => {
    fs.readdir(dataDir, {withFileTypes: true}, (err, files) => {
      if (err) {
        reject('Fehler beim Lesen des Data-Verzeichnisses:', err);
      } else {
        // Filtert nur Ordner heraus und gibt sie zurück
        const directories = files.filter(file => file.isDirectory()).map(file => file.name);
        resolve(directories);
      }
    });
  });
};

// init files
let directories = [];

const app = express();
const port = 3000;

async function startServer() {

  directories = await checkDataDirectories();

  // create json files
  for (let d of directories) {
    try {
      console.log("DIR", d);

      const notes = readNotes(d);
      const reservations = getReservations(d);

      console.log(notes)
      console.log(reservations)

      const result = assignTables(reservations, availableTables, notes);
      const platsReservierungenJSON = JSON.stringify(result, null, 2)
      // console.log(platsReservierungenJSON);
      fs.writeFileSync(path.join(__dirname, 'public', 'data', d, 'platzierteReservierungen.json'), platsReservierungenJSON)

      const roomsLookup = getRoomsLookup(result);
      const roomsLookupJSON = JSON.stringify(roomsLookup, null, 2)
      // console.log(roomsLookupJSON);
      fs.writeFileSync(path.join(__dirname, 'public', 'data', d, 'roomsLookup.json'), roomsLookupJSON);
    } catch (e) {
      console.error(`Cannot create data for ${d}:`, e);
    }
  }

  app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
  });
}


// Setze Handlebars als View Engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Setze das 'public' Verzeichnis als statisches Verzeichnis
app.use(express.static(path.join(__dirname, 'public')));


// Rufe die Funktion auf, um die Ordner bei der Startseite anzuzeigen
app.get('/', async (req, res) => {
  if (directories) {
    res.render('index', {directories}); // Übergibt die Ordner an das Template
  } else {
    console.error(error);
    res.status(500).send('Fehler beim Laden der Ordner');
  }
});

// Detailseite für einen bestimmten Ordner
app.get('/detail/:folder', (req, res) => {
  const folderName = req.params.folder;
  const folderPath = path.join(__dirname, 'public', 'data', folderName);

  // Prüfe, ob der angeforderte Ordner existiert
  fs.stat(folderPath, (err, stats) => {
    if (err || !stats.isDirectory()) {
      return res.status(404).send('Ordner nicht gefunden');
    }

    try {
      const platzierteReservierungen = JSON.parse(fs.readFileSync(path.join(folderPath, 'platzierteReservierungen.json'), 'utf-8'));

      res.render('detail', {
        folderName,
        path: folderPath,
        platzierteReservierungen,
        stats
      });
    } catch (e) {
      return res.status(500).send(e);
    }
  });
});

// Starte den Server
startServer();
