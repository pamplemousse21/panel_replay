<script context="module" lang="ts">
  export interface Point {
    lat: number;
    lon: number;
    timestamp: string; // ou Date, selon votre besoin
    transmission: string;
  }
</script>

<script lang="ts">
  export let points: Point[] = []; // Liste des points
  export let selectedPoint: Point | null = null; // Point sélectionné depuis l'extérieur
  export let onPointClick: (point: Point) => void = () => {};

  let selectedPointIndex: number | null = null; // Index du point sélectionné
  let tableBody: HTMLTableSectionElement | null = null; // Référence au corps du tableau

  // Réagir aux changements de `selectedPoint`
  $: selectedPointIndex = selectedPoint
    ? points.findIndex(
        (p) =>
          p.lat === selectedPoint.lat &&
          p.lon === selectedPoint.lon &&
          p.timestamp === selectedPoint.timestamp
      )
    : null;

  $: {
    if (selectedPointIndex !== null) {
      scrollToSelectedPoint(); // Défilement automatique uniquement si un point est trouvé
    }
  }

  function handlePointClick(point: Point, index: number) {
    selectedPointIndex = index; // Mettre à jour l'index local
    selectedPoint = point;
    onPointClick(point); // Notifier le parent
  }

  function stopScrollPropagation(event: Event) {
    event.stopPropagation();
  }

  // Fonction pour défiler vers le point sélectionné
  function scrollToSelectedPoint() {
    if (selectedPointIndex !== null && tableBody) {
      const row = tableBody.children[selectedPointIndex] as HTMLElement;
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }
</script>

<div class="overlay-points" on:wheel={stopScrollPropagation}>
  <h3>Points</h3>
  {#if points.length > 0}
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Timestamp</th>
          <th>Mode</th>
        </tr>
      </thead>
      <tbody bind:this={tableBody}>
        {#each points as { lat, lon, timestamp, transmission }, index}
          <tr
            class:selected={index === selectedPointIndex}
            on:click={() =>
              handlePointClick({ lat, lon, timestamp, transmission }, index)}
          >
            <td>{index + 1}</td>
            <td>{lat}</td>
            <td>{lon}</td>
            <td>{new Date(timestamp).toLocaleString()}</td>
            <td>
              <span
                class={`icon ${
                  transmission === "GSM" ? "icon-gsm" : "icon-satellite"
                } ${selectedPointIndex === index ? "icon-selected" : ""}`}
                title={transmission}
              ></span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p style="padding: 10px; text-align: center; color: #7f8c8d;">
      No points available
    </p>
  {/if}
</div>

<style>
  .overlay-points {
    position: absolute;
    top: 400px; /* Positionné sous la liste des balises */
    left: 20px;
    width: 450px; /* Taille fixe en largeur */
    max-height: 400px; /* Taille fixe en hauteur */
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    padding: 0px;
    z-index: 999; /* Sous la liste des balises */
  }

  .overlay-points h3 {
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

  .overlay-points table {
    width: 100%;
    border-collapse: collapse;
  }

  .overlay-points th,
  .overlay-points td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    font-size: 0.9rem;
  }

  .overlay-points th {
    background-color: #f4f4f9;
    font-weight: bold;
  }

  .overlay-points tr:hover {
    background-color: #f2f2f2;
  }

  .icon {
    width: 16px;
    height: 16px;
    display: inline-block;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .icon-gsm {
    background-image: url("/public/assets/GSM.png"); /* Chemin vers l'icône GSM */
  }

  .icon-satellite {
    background-image: url("/public/assets/SAT.png"); /* Chemin vers l'icône Satellite */
  }

  .selected {
    background-color: #242526; /* Couleur de fond pour le point sélectionné */
    color: white; /* Couleur du texte */
    font-weight: bold; /* Texte plus gras */
  }

  .icon-selected {
    filter: invert(1); /* Inverse les couleurs de l'image */
  }
</style>
