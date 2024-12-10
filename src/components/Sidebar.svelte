<script>
    export let onChangePage; // Prop pour le callback
  
    let menuItems = [
    { name: 'Home', icon: 'fas fa-home' },
    { name: 'Profile', icon: 'fas fa-user' },
    { name: 'Settings', icon: 'fas fa-cogs' },
    { name: 'About', icon: 'fas fa-info-circle' }
  ];
  
    // Appeler la fonction de rappel passée en prop
    function handleClick(itemName) {
      if (onChangePage) {
        onChangePage(itemName.toLowerCase()); // Passer le nom de la page au parent
      }
    }
  </script>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

  <style>


.container {
    width: 250px;
  display: flex;
 
  flex-direction: column;
  align-items: center; /* Centrer la carte et les contrôles horizontalement */
  padding: 10px; /* Ajout d'un peu de padding */
  background-color: #f4f4f9; /* Couleur de fond douce */
  border-radius: 10px; /* Coins arrondis */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Ombre portée légère */
}
   .sidebar {
    flex: 1;
    width: 80%;
  
  background-color: #171718; /* Couleur de fond sombre et élégante */
  color: #ecf0f1; /* Couleur du texte claire */
  display: flex;
  flex-direction: column;
  padding: 20px; /* Ajout de padding pour l'espacement */
  border-radius: 10px; /* Coins arrondis pour un effet plus doux */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Ombre portée plus marquée */
  transition: transform 0.3s; /* Animation lors de l'ouverture/fermeture */
}

/* Effet de survol de la barre latérale */


/* Styles des éléments de menu */
.menu-item {
  
  align-items: center;
  padding: 5px 20px; /* Padding plus grand pour plus d'espace */
  margin: 8px 0; /* Marges pour séparer les éléments */
  cursor: pointer;
  border-radius: 8px; /* Coins arrondis */
  transition: background-color 0.3s, transform 0.3s; /* Animation de survol */
  font-size: 1rem; /* Taille du texte */
  font-weight: 500; /* Poids de police pour un effet de lisibilité */
  
}

.menu-item i {
  margin-right: 20px; /* Espacement entre l'icône et le texte */
 
}


/* Animation de survol des éléments de menu */
.menu-item:hover {
  background-color: #ed6C64; /* Couleur de survol */
  transform: translateX(5px); /* Effet de translation au survol */
}

/* Styles pour l'icône à gauche du texte */
.menu-item span {
  margin-right: 20px; /* Espacement à droite de l'icône */
  
  font-size: 1.5em; /* Taille de l'icône */
}

/* Styles du titre de la barre latérale */
h1 {
  color: #ecf0f1; /* Couleur claire du texte */
  font-size: 28px; /* Taille du texte pour le titre */
  font-weight: bold; /* Poids du texte en gras */
  padding-bottom: 15px; /* Espacement sous le titre */
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2); /* Ombre portée plus marquée */
}

    
  </style>
  <div class="container">
  <div class="sidebar">
    <h1>Panel</h1>
    {#each menuItems as item}
      <div
        class="menu-item"
        role="button"
        tabindex="0"
        on:click={() => handleClick(item.name)}
        on:keydown={(e) => e.key === 'Enter' && handleClick(item.name)}
      >
      <i class={item.icon}></i> <!-- Icône Font Awesome -->
        {item.name}
      </div>
    {/each}
  </div>
</div>