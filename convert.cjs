const fs = require('fs');
const path = require('path');

// Chemins des fichiers
const inputFile = path.join(__dirname, 'classified_timestamps_with_location.txt'); // Fichier texte d'entrée
const outputFile = path.join(__dirname, 'beacons.json'); // Fichier JSON de sortie

// Fonction pour convertir le fichier texte en JSON
function convertTxtToJson() {
    // Lire le fichier texte
    const data = fs.readFileSync(inputFile, 'utf-8');

    // Découper les lignes
    const lines = data.split('\n').filter(line => line.trim() !== '');

    const beacons = {};

    // Parcourir chaque ligne
    lines.forEach(line => {
        const point = {};

        // Extraire les informations de la ligne
        const timestampMatch = line.match(/point:\s([\d\-:\s]+)/);
        const modeMatch = line.match(/Mode:\s(\w+)/);
        const iccidMatch = line.match(/ICCID:\s(\d+)/);
        const latitudeMatch = line.match(/Latitude:\s([\d.]+)/);
        const longitudeMatch = line.match(/Longitude:\s([\d.]+)/);

        if (timestampMatch) point.timestamp = timestampMatch[1].trim();
        if (modeMatch) point.transmission = modeMatch[1];
        if (latitudeMatch) point.lat = parseFloat(latitudeMatch[1]);
        if (longitudeMatch) point.lon = parseFloat(longitudeMatch[1]);

        // Valeurs fixes pour la batterie et la vitesse
        point.battery = 100; // Valeur fixe pour la batterie
        point.speed = 0; // Valeur fixe pour la vitesse

        const iccid = iccidMatch ? iccidMatch[1] : 'unknown';

        // Ajouter ce point à la balise correspondante
        if (!beacons[iccid]) {
            beacons[iccid] = {
                number: iccid, // Utiliser ICCID comme numéro de balise
                positions: [],
            };
        }
        beacons[iccid].positions.push(point);
    });

    // Convertir les données en tableau
    const result = Object.values(beacons);

    // Écrire dans le fichier JSON
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`Conversion terminée ! Fichier généré : ${outputFile}`);
}

// Lancer la conversion
convertTxtToJson();
