<script>
    export let beacons = []; // Liste des balises avec leurs informations
    export let onSelect = (beacon) => {}; // Fonction callback pour informer du choix de balise
  
    let selectedBeaconNumber = null; // Contiendra le numéro de la balise sélectionnée
  
    function handleSelect(beacon) {
      selectedBeaconNumber = beacon.number; // Met à jour la balise sélectionnée
      onSelect(beacon); // Appelle le callback
    }
  
    function stopScrollPropagation(event) {
      event.stopPropagation();
    }
  </script>
  
  
  <style>
    .overlay-list {
      position: absolute;
      top: 100px;
      left: 20px;
      width: 300px; /* Taille fixe en largeur */
      max-height: 350px; /* Taille fixe en hauteur */
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      overflow-y: auto;
      padding: 0px;
      z-index: 1000;
    }
  
    .overlay-list h3 {
      position: sticky; /* Titre reste fixe */
      top: 0; /* Attaché en haut de l'encadré */
      margin: 0; /* Supprimer les marges inutiles */
      padding: 10px; /* Ajout de padding interne */
      padding-left: 20px;
      font-size: 1.2rem; /* Taille du texte */
      background: white; /* Fond solide pour masquer le contenu défilant */
      color: #34495e; /* Couleur du texte */
      border-bottom: 1px solid #dcdde1; /* Ligne douce de démarcation */
      z-index: 10; /* S'assurer qu'il reste au-dessus du contenu */
    }
  
    .overlay-list ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  

  
    .beacon-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  
    .status-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  
}

.status-icon.connected {
  background-color: green; /* Couleur pour la connexion */
}

.status-icon.disconnected {
  background-color: red; /* Couleur pour la déconnexion */
}


    
 
    .battery-level,
    .speed {
      font-size: 0.9rem;
      color: #7f8c8d; /* Couleur gris pour les détails */
    }

    .beacon-item {
  display: block;
  width: 100%; /* Prendre toute la largeur du parent */
  text-align: left;
  border: none;
  background: none;
  padding: 10px; /* Ajout d'un padding pour l'espacement */
  margin: 5px 0;
  cursor: pointer; /* Indiquer que l'élément est cliquable */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  transition: background-color 0.3s, box-shadow 0.3s; /* Effet de transition */
}

.beacon-item:hover,
.beacon-item:focus {
  background-color: #e0e0e0; /* Changement de fond au survol */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Ombre plus marquée */
}

.beacon-item:active {
  background-color: #d0d0d0; /* Changement de fond lors du clic */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Ombre moins marquée pour l'effet de clic */
}

.beacon-item.selected {
  background-color: #242526; /* Couleur de fond pour la sélection */
  color: white; /* Couleur du texte */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); /* Ombre plus marquée */
  font-weight: bold; /* Texte plus gras */
}


  </style>
  
  <div class="overlay-list" on:wheel={stopScrollPropagation}>
    <h3>Beacons</h3>
    <ul>
        {#each beacons as beacon, index}
          <button
            class="beacon-item {selectedBeaconNumber === beacon.number ? 'selected' : ''}"
            on:click={() => handleSelect(beacon)}
            aria-label={`Details for beacon ${beacon.number}`}
          >
            <div class="beacon-info">
              <i class={`status-icon ${beacon.connected ? 'connected' : 'disconnected'}`}>•</i>
              <span>{beacon.number}</span>
            </div>
            <div class="details">
              <span class="battery-level">Battery: {beacon.battery}%</span>
              <span class="speed">Speed: {beacon.speed} km/h</span>
            </div>
          </button>
        {/each}
      </ul>
  </div>
  