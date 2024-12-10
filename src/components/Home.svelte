<script>
    import OverlayList from './GpsTagList.svelte';
    import GpsPointList from './GpsPointList.svelte';
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import beaconsData from './beacons.json'; // Import des données JSON
  
    let map;
    let isPlaying = false;
    let currentPositionIndex = 0; // Index actuel dans le tableau de positions
    let timeInterval; // Intervalle pour la lecture
    let markers = []; // Tableau des marqueurs ajoutés
    let polylines = []; // Tableau des lignes ajoutées

    let beacons = beaconsData; // Chargement des balises depuis le fichier JSON
    let selectedBeacon = null; // Balise actuellement sélectionnée
    let positions = []; // Positions utilisées pour le lecteur

    let selectedPoints = []; // Points de la balise sélectionnée
    let selectedPoint = null; // Point sélectionné (pour la synchronisation)

    let reachedPoints = new Set(); // Ensemble des indices des points atteints

    function focusPoint(point) {
    selectedPoint = point; // Mettre à jour le point sélectionné global
    map.setView([point.lat, point.lon], 15); // Centrer la carte sur le point cliqué
}


    
    onMount(() => {
      // Initialisation de la carte
      map = L.map('map').setView([0, 0], 2);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
    });

    
  
    function clearMarkers() {
      // Supprimer tous les marqueurs et lignes de la carte
      markers.forEach(marker => map.removeLayer(marker));
      markers = [];
  
      polylines.forEach(polyline => map.removeLayer(polyline));
      polylines = [];
    }
  
    function selectBeacon(beacon) {
    selectedBeacon = beacon;
    positions = beacon.positions; // Charger les positions spécifiques à la balise
    selectedPoints = positions; // Mettre à jour les points pour GpsPointList
    currentPositionIndex = 0; // Réinitialiser l'index

    // Supprimer les marqueurs existants
    clearMarkers();

    // Centrer sur le premier point de la nouvelle balise
    if (positions.length > 0) {
      map.setView([positions[0].lat, positions[0].lon], 5);
      addPolylinesForHistory(); // Ajoute les lignes pointillées initiales
    }
  }
  let appearedPoints = []; // Points qui sont déjà apparus
  function addPolylinesForHistory() {
  // Trier les positions par timestamp pour tracer les traits pointillés
  const sortedPositions = positions.slice().sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  sortedPositions.forEach(({ lat, lon }, index) => {
    if (index > 0) {
      const prevPosition = sortedPositions[index - 1];
      const polyline = L.polyline(
        [
          [prevPosition.lat, prevPosition.lon],
          [lat, lon]
        ],
        {
          color: '#ed6c64', // Couleur du trait pointillé
          weight: 3, // Épaisseur
          dashArray: '5, 10', // Pointillé
          opacity: 0.8, // Opacité légère
        }
      ).addTo(map);

      // Associer les traits avec les positions dans l'ordre original du fichier
      polylines.push({
        line: polyline,
        startIndex: positions.indexOf(prevPosition), // Index dans l'ordre du fichier
        endIndex: positions.indexOf({ lat, lon }),   // Index dans l'ordre du fichier
      });
    }
  });
}


let playbackSpeed = 100; // Intervalle en millisecondes (1 seconde par défaut)

function startPlayback() {
  if (!isPlaying && positions.length > 0) {
    isPlaying = true;
    timeInterval = setInterval(() => {
      if (currentPositionIndex < positions.length) {
        updateMap(currentPositionIndex);
        currentPositionIndex++;
      } else {
        clearInterval(timeInterval);
        isPlaying = false;
      }
    }, playbackSpeed); // Utilise la vitesse définie
  }
}
function changeSpeed(event) {
  playbackSpeed = parseInt(event.target.value, 10); // Mettre à jour la vitesse
  if (isPlaying) {
    pausePlayback(); // Arrête le lecteur temporairement
    startPlayback(); // Redémarre avec la nouvelle vitesse
  }
}
  
    function pausePlayback() {
      clearInterval(timeInterval);
      isPlaying = false;
    }
  
    function rewindPlayback() {
      clearInterval(timeInterval);
      isPlaying = false;
      currentPositionIndex = 0;
  
      // Supprimer les marqueurs existants
      clearMarkers();
  
      // Réafficher uniquement les lignes initiales
      if (positions.length > 0) {
        map.setView([positions[0].lat, positions[0].lon], 5);
        addPolylinesForHistory();
      }
    }
  
    function handleTimeChange(event) {
      pausePlayback(); // Arrêter la lecture si en cours
      currentPositionIndex = parseInt(event.target.value, 10); // Mettre à jour l'index
      console.log('Adding');
      updateMap(currentPositionIndex);
    }
  
    function updateMap(index) {

        
  if (index < positions.length) {
    const { lat, lon, transmission, timestamp } = positions[index];
    selectedPoint = { lat, lon, transmission, timestamp }; // Synchroniser avec le point sélectionné

    // Supprimer les anciens marqueurs animés avant d'ajouter un nouveau
    markers.forEach((marker) => {
      if (marker.options.icon && marker.options.icon.options.className === 'selected-animation') {
        map.removeLayer(marker);
      }
    });

// Créer un marqueur animé pour le point sélectionné
const animatedMarker = L.divIcon({
  className: 'selected-animation',
  html: `
    <div class="animated-circle"></div> `,
  iconAnchor: [10, 10], // Centre le marqueur par rapport à la carte
});

const animationLayer = L.marker([lat, lon], { icon: animatedMarker }).addTo(map);
markers.push(animationLayer);



    // Créer un marqueur normal pour le point
    const marker = L.circleMarker([lat, lon], {
      radius: 6,
      color: 'red',
      fillColor: 'red',
      fillOpacity: 1,
    }).addTo(map);

    markers.push(marker);

    // Ajouter l'icône pour les points SAT si nécessaire
    if (transmission === 'SAT') {
      const satIcon = L.divIcon({
        className: 'satellite-icon',
        html: `
          <div class="satellite-icon-container">
            <img src="/assets/SAT.png" class="inverted-icon" />
          </div>
        `,
        iconAnchor: [6, 20],
      });

      const iconMarker = L.marker([lat, lon], { icon: satIcon }).addTo(map);
      markers.push(iconMarker);
      iconMarker.on('click', () => focusPoint({ lat, lon, transmission, timestamp }));
    }

    // Mettre à jour les polylines
    updatePolylines(index);
  }
}





let selectedPointIndex = null; // Index du point sélectionné dans la liste

function selectPointInList(point) {
  selectedPointIndex = positions.findIndex(
    (p) => p.lat === point.lat && p.lon === point.lon && p.timestamp === point.timestamp
  );

  // Met à jour l'état pour refléter la sélection dans GpsPointList
  selectedPoints = [...positions]; // Forcer la mise à jour dans Svelte
}

  
function updatePolylines(index) {
  const currentPoint = positions[index];
  appearedPoints.push(currentPoint); // Ajouter le point actuel aux points apparus

  // Vérifier chaque trait dans l'ordre des polylines
  polylines.forEach(({ line, startIndex, endIndex }) => {
    const startPointAppeared = appearedPoints.includes(positions[startIndex]);
    const endPointAppeared = appearedPoints.includes(positions[endIndex]);

    // Si les deux extrémités du trait sont atteintes
    if (startPointAppeared && endPointAppeared) {
      line.setStyle({
        dashArray: null, // Retirer les pointillés
        color: 'blue', // Passer en bleu continu
        weight: 4, // Épaisseur du trait continu
      });
    }
  });
}


  </script>

<style>
  /* Container global */
  .container {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center; /* Centrer la carte et les contrôles horizontalement */
    padding: 20px; /* Ajout d'un peu de padding */
    background-color: #f4f4f9; /* Couleur de fond douce */
    border-radius: 10px; /* Coins arrondis */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Ombre portée légère */
  }

  /* Style de la carte */
  #map {
    flex: 1;
    width: 100%;
    height: 500px; /* Hauteur fixe pour la carte */
    border-radius: 20px; /* Coins arrondis */
    border: 5px solid #ddd; /* Bordure claire */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Ombre portée de la carte */
  }

  /* Barre de contrôle sous la carte */
  .controls {
    background-color: #171718; /* Couleur de fond sombre pour la barre */
    height: 120px; /* Hauteur augmentée pour mieux visualiser les contrôles */
    width: 100%; /* Largeur pleine */
    display: flex;
    flex-direction: row; /* Organise les contrôles en ligne */
    justify-content: space-around; /* Espace égal entre les éléments */
    align-items: center; /* Centre les éléments verticalement */
    border-radius: 10px; /* Coins arrondis */
    margin-top: 20px; /* Espace au-dessus */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Ombre légère */
  }

  /* Style des boutons */
  button {
    background-color: #c4bebe; /* Couleur principale */
    color: #000000; /* Texte blanc */
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    margin: 10px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s; /* Animation de survol */
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  /* Animation de survol des boutons */
  button:hover {
    background-color: #ed6C64; /* Couleur plus foncée */
    transform: scale(1.05); /* Agrandissement */
  }

  /* Style de la barre de défilement */
  input[type="range"] {
    width: 90%; /* Largeur de la barre */
    appearance: none; /* Supprime l'apparence par défaut */
    height: 10px; /* Hauteur de la barre */
    border-radius: 5px; /* Coins arrondis */
    background: #34495e; /* Couleur de la barre */
    outline: none; /* Supprime le contour */
    cursor: pointer;
    margin-top: 10px; /* Espace au-dessus */
  }

  /* Style de la poignée de la barre de défilement */
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 20px; /* Largeur du curseur */
    height: 20px; /* Hauteur du curseur */
    border-radius: 50%; /* Forme circulaire */
    background: #ED6C64; /* Couleur du curseur */
    cursor: pointer;
    transition: background-color 0.3s;
  }

  /* Animation de survol du curseur */
  input[type="range"]::-webkit-slider-thumb:hover {
    background-color: #ed6d64bb; /* Couleur plus foncée */
  }

  .controls {
    background-color: #171718; /* Couleur de fond sombre pour la barre */
    height: 120px; /* Hauteur augmentée pour mieux visualiser les contrôles */
    width: 100%; /* Largeur pleine */
    display: flex;
    flex-direction: row; /* Organise les contrôles en ligne */
    justify-content: space-between; /* Espace entre les groupes */
    align-items: center; /* Centre les éléments verticalement */
    border-radius: 10px; /* Coins arrondis */
    margin-top: 20px; /* Espace au-dessus */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Ombre légère */
  }

  .control-buttons {
    display: flex;
    gap: 10px; /* Espace entre les boutons */
  }

  .control-buttons button {
    background-color: #c4bebe; /* Couleur principale */
    color: #000000; /* Texte blanc */
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s; /* Animation de survol */
    font-size: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .control-buttons button:hover {
    background-color: #ed6C64; /* Couleur plus foncée */
    transform: scale(1.05); /* Agrandissement */
  }

  .timeline {
    flex-grow: 1; /* Prend tout l'espace restant */
    margin-left: 20px; /* Espace à gauche de la barre de progression */
  }

  .satellite-icon img {
  display: block;
  pointer-events: none; /* Empêche l'interaction avec l'icône */
}

:global(.satellite-icon-container) {
    width: 20px; /* Taille réduite du conteneur */
  height: 20px;
  background-color: black; /* Fond noir */
  border-radius: 50%; /* Cercle parfait */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* Ombre pour un effet esthétique */
}

:global(.satellite-icon-container img) {
    width: 10px; /* Taille réduite de l'icône */
  height: 10px;
  filter: invert(1); /* Inversion des couleurs */
}

:global(.selected-animation) {
  position: absolute; /* Maintient le conteneur en place */
  width: 40px; /* Taille fixe correspondant à l'icône centrale */
  height: 40px;
  background-color: red; /* Couleur centrale */
  border: 3px solid white; /* Contour blanc autour du point */
  border-radius: 50%; /* Forme circulaire */
  animation: halo 2s infinite; /* Applique l'animation */
  pointer-events: none; /* Empêche les interactions */
}

:root {
  --halo-color: #ed6c64; /* Couleur principale */
  --halo-color-rgb: 237, 108, 100; /* Valeur RGB de la couleur principale */
}



@keyframes halo {
  0% {
    box-shadow: 0 0 10px 5px rgba(var(--halo-color-rgb), 0.6),
                0 0 20px 15px rgba(var(--halo-color-rgb), 0.4),
                0 0 30px 25px rgba(var(--halo-color-rgb), 0.2);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 15px 10px rgba(var(--halo-color-rgb), 0.4),
                0 0 30px 25px rgba(var(--halo-color-rgb), 0.2),
                0 0 50px 40px rgba(var(--halo-color-rgb), 0.1);
    opacity: 0.8;
  }
  100% {
    box-shadow: 0 0 10px 5px rgba(var(--halo-color-rgb), 0.6),
                0 0 20px 15px rgba(var(--halo-color-rgb), 0.4),
                0 0 30px 25px rgba(var(--halo-color-rgb), 0.2);
    opacity: 1;
  }
}










</style>

<div class="container">
    <div id="map">
      <!-- Liste des balises -->
      <OverlayList {beacons} onSelect={selectBeacon} />
      <!-- Liste des points -->
      <GpsPointList points={selectedPoints} selectedPoint={selectedPoint} onPointClick={focusPoint} />


    </div>
  
    <div class="controls">
        <!-- Boutons -->
        <div class="control-buttons">
          <button on:click={rewindPlayback}>Rewind</button>
          <button on:click={isPlaying ? pausePlayback : startPlayback}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      
        <!-- Barre de progression -->
        <input
          type="range"
          min="0"
          max={positions.length - 1}
          step="1"
          value={currentPositionIndex}
          on:input={handleTimeChange}
        />
      
        <!-- Contrôle de vitesse -->
        <div class="speed-control">
          <label for="speed">Speed: </label>
          <input
            id="speed"
            type="range"
            min="100"  
            max="2000" 
            step="100"
            value={playbackSpeed}
            on:input={changeSpeed}
          />
          <span>{playbackSpeed} ms</span>
        </div>
      </div>
  </div>