const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')
const folder = './public/data';

const availableTables =
  [
    {id: 1, typ: '6er', capacity: 6},
    {id: 2, typ: '6er', capacity: 6},
    {id: 3, typ: '6er', capacity: 6},
    {id: 4, typ: '6er', capacity: 6},
    {id: 5, typ: '6er', capacity: 6},
    {id: 6, typ: '6er', capacity: 6},
    {id: 7, typ: '6er', capacity: 6},
    {id: 8, typ: '6er', capacity: 6},
    {id: 9, typ: '6er', capacity: 6},
    {id: 10, typ: '6er', capacity: 6},
    {id: 11, typ: '6er', capacity: 6},
    {id: 12, typ: '6er', capacity: 6},
    {id: 13, typ: '6er', capacity: 6},
    {id: 14, typ: '6er', capacity: 6},
    {id: 15, typ: '6er', capacity: 6},
    {id: 16, typ: '6er', capacity: 6},
    {id: 17, typ: '6er', capacity: 6},
    {id: 18, typ: '6er', capacity: 6},
    {id: 19, typ: '6er', capacity: 6},
    {id: 20, typ: '6er', capacity: 6},
    {id: 21, typ: '6er', capacity: 6},
    {id: 22, typ: '6er', capacity: 6},
    {id: 23, typ: '6er', capacity: 6},
    {id: 24, typ: '6er', capacity: 6},
    {id: 25, typ: '6er', capacity: 6},
    {id: 26, typ: '6er', capacity: 6},
    {id: 27, typ: '6er', capacity: 6},
    {id: 28, typ: '6er', capacity: 6},
    {id: 29, typ: '6er', capacity: 6},
    {id: 30, typ: '6er', capacity: 6},
    {id: 31, typ: '6er', capacity: 6},
    {id: 32, typ: '6er', capacity: 6},
    {id: 33, typ: '6er', capacity: 6},
    {id: 34, typ: '6er', capacity: 6},
    {id: 35, typ: '6er', capacity: 6},
    {id: 36, typ: '6er', capacity: 6},
    {id: 37, typ: '6er', capacity: 6},
    {id: 38, typ: '6er', capacity: 6},
    {id: 39, typ: '6er', capacity: 6},
    {id: 40, typ: '6er', capacity: 6},
    {id: 41, typ: '6er', capacity: 6},
    {id: 42, typ: '6er', capacity: 6},
    {id: 43, typ: '6er', capacity: 6},
    {id: 44, typ: '6er', capacity: 6},
    {id: 45, typ: '6er', capacity: 6},
    {id: 46, typ: '6er', capacity: 6},
    {id: 47, typ: '6er', capacity: 6},
    {id: 48, typ: '6er', capacity: 6},
    {id: 49, typ: '6er', capacity: 6},
    {id: 50, typ: '6er', capacity: 6},
    {id: 51, typ: '6er', capacity: 6},
    {id: 52, typ: '6er', capacity: 6},
    {id: 53, typ: '6er', capacity: 6},
    {id: 54, typ: '6er', capacity: 6},
    {id: 55, typ: '6er', capacity: 6},
    {id: 56, typ: '6er', capacity: 6},
    {id: 57, typ: '6er', capacity: 6},
    {id: 58, typ: '6er', capacity: 6},
    {id: 59, typ: '6er', capacity: 6},
    {id: 60, typ: '6er', capacity: 6},
    {id: 61, typ: '6er', capacity: 6},
    {id: 62, typ: '6er', capacity: 6},
    {id: 63, typ: '6er', capacity: 6},
    {id: 64, typ: '6er', capacity: 6},
    {id: 65, typ: '6er', capacity: 6},
    {id: 66, typ: '6er', capacity: 6},
    {id: 67, typ: '6er', capacity: 6},
    {id: 68, typ: '6er', capacity: 6},
    {id: 69, typ: '4er', capacity: 4},
    {id: 70, typ: '4er', capacity: 4},
    {id: 71, typ: '4er', capacity: 4},
    {id: 72, typ: '4er', capacity: 4},
    {id: 73, typ: '4er', capacity: 4},
    {id: 74, typ: '4er', capacity: 4},
    {id: 75, typ: '4er', capacity: 4},
    {id: 76, typ: '4er', capacity: 4},
    {id: 77, typ: '4er', capacity: 4},
    {id: 78, typ: '4er', capacity: 4},
    {id: 79, typ: '4er', capacity: 4},
    {id: 80, typ: '4er', capacity: 4},
    {id: 81, typ: '4er', capacity: 4},
    {id: 82, typ: '4er', capacity: 4},
    {id: 83, typ: '4er', capacity: 4},
    {id: 84, typ: '4er', capacity: 4},
    {id: 85, typ: '4er', capacity: 4}
  ]


function getReservations(date) {
  const dateFolder = path.join(folder, date);
  const fileName = findFile(dateFolder, '.xlsx')
  const workbook = XLSX.readFile(path.join(dateFolder, fileName));
  const sheet_name_list = workbook.SheetNames;
  // skip first 3 rows
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {range: 3}).map(d => ({
    anzahl: d['#Besucher'],
    erw: d['davon Erw.'],
    kind: d['davon \r\n5-12 J.'],
    kleinkind: d['davon \r\n0-4 J.'],
    Nachname: d.Nachname,
    Vorname: d.Vorname,
    Bestellnummer: d.Bestellnummer,
  }));
}

function findFile(directoryPath, ext) {
  const files = fs.readdirSync(directoryPath)
  const extFiles = files.filter(file => path.extname(file) === ext);
  return extFiles[0];
}

function readNotes(date) {
  const dateFolder = path.join(folder, date);
  const fileName = findFile(dateFolder, '.txt');
  const text = fs.readFileSync(path.join(dateFolder, fileName), 'utf-8').toString();
  return extractNotes(text)
}

function extractNotes(text) {
  const regex = /\((\d+), (\d+ Personen?)\)(.*)(\r)?\n/gm;
  const notes = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const orderNumber = match[1];
    const people = parseInt(match[2], 10);
    const comment = match[3].trim();

    // Check if "Empore" is mentioned in the comment
    const isEmpore = /Empore/.test(comment);

    notes.push({
      text: `${orderNumber}, ${people} Personen${comment ? ' ' + comment : ''}`,
      empore: isEmpore,
      Bestellnummer: orderNumber
    });
  }

  return notes;
}

// Funktion zur Platzierung der Tische basierend auf der Reservierung
function assignTables(reservations, availableTables, notes) {
  const result = {assigned: [], errors: []};
  let totalSeatsAvailable = availableTables.reduce((sum, table) => sum + table.capacity, 0);
  let totalSeatsRequired = reservations.reduce((sum, reservation) => sum + reservation.anzahl, 0);

  // Überprüfen, ob insgesamt genug Plätze verfügbar sind
  if (totalSeatsRequired > totalSeatsAvailable) {
    result.errors.push('Fehler: Nicht genügend Plätze für alle Reservierungen verfügbar!');
  }

  // Hilfsfunktion zum Sortieren der Tische (bevorzugt leere Tische)
  function sortTablesByEmptySpace() {
    availableTables.sort((a, b) => b.capacity - a.capacity);
  }

  reservations.sort((a, b) => b.anzahl - a.anzahl).forEach(reservation => {
    let remainingPeople = reservation.anzahl;
    let assignedTables = [];

    // Vor dem Zuweisen die Tische nach verfügbarem Platz sortieren
    sortTablesByEmptySpace();


    // Versuchen, Tische zuzuweisen, bis alle Personen platziert sind
    for (let table of availableTables) {
      if (remainingPeople <= 0) break; // Alle Personen wurden platziert

      // TODO: Spezialfall 7-8 -> 6er + 1-2 Stühle
      // TODO: Spezialfall 14 -> 2x 6er + 2 Stühle

      if (table.capacity > 0) {
        let seatsToAssign = Math.min(table.capacity, remainingPeople);
        assignedTables.push({id: table.id, typ: table.typ, seats: seatsToAssign});

        remainingPeople -= seatsToAssign;
        table.capacity -= seatsToAssign; // Reduziert die Kapazität des Tisches

        // Wenn der Tisch voll ist, wird er aus der Liste entfernt
        if (table.capacity === 0) {
          availableTables = availableTables.filter(t => t.id !== table.id);
        }
      }
    }

    // Falls nach der Zuweisung noch Personen übrig sind, bedeutet das, dass wir nicht genügend Tische hatten
    if (remainingPeople > 0) {
      result.errors.push(`Warnung: Nicht genug Platz für Reservierung ${reservation.Bestellnummer}, ${remainingPeople} Personen konnten nicht platziert werden.`);
    }
    // Reservierung mit den zugewiesenen Tischen hinzufügen
    result.assigned.push({
      Nachname: reservation.Nachname,
      Vorname: reservation.Vorname,
      Bestellnummer: reservation.Bestellnummer,
      anzahl: reservation.anzahl,
      zugewieseneTische: assignedTables,
      Notizen: notes.filter(n => n.Bestellnummer === reservation.Bestellnummer)
    });
  });

  return result;
}

function getRoomsLookup(result) {
  const roomsLookup = {}

  for (let r of result.assigned) {
    for (let t of r.zugewieseneTische) {
      if (!roomsLookup[t.id]) {
        roomsLookup[t.id] = {seats: 0, typ: t.typ, id: t.id, reservierungen: []}
      }
      roomsLookup[t.id].seats += t.seats;
      roomsLookup[t.id].reservierungen.push({
        Nachname: r.Nachname,
        Vorname: r.Vorname,
        Bestellnummer: r.Bestellnummer,
        anzahl: r.anzahl,
        Notizen: r.Notizen
      });
    }
  }
  return roomsLookup;
}

module.exports = {assignTables, getRoomsLookup, readNotes, getReservations, availableTables}