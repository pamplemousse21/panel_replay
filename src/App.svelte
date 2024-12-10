<script>
  import Sidebar from './components/Sidebar.svelte';
  import MainContent from './components/MainContent.svelte';
  import Home from './components/Home.svelte'; // Importez le composant Home

  let activePage = 'home'; // État pour suivre la page active

  function setActivePage(page) {
    activePage = page;
  }
</script>

<style>
  .app-container {
    display: flex;
    
    height: 100vh; /* Pour occuper toute la hauteur de la page */
  }




</style>

<div class="app-container">
  <Sidebar onChangePage={setActivePage} /> <!-- Passer la fonction de rappel -->
  {#if activePage === 'home'}
    <Home />
  {/if}
  {#if activePage !== 'home'}
    <MainContent />
  {/if}
</div>
