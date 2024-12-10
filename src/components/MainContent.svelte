<script>
    let content = "Welcome to MyApp! Select an item from the sidebar to get started.";
    let tab = [1, 2, 3];
  </script>
  
  <style>
    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #ecf0f1;
      overflow-y: auto;
    }
  
    h2 {
      color: #2c3e50;
    }
  
    p {
      color: #171718;
      line-height: 1.6;
    }
  
    ul {
      margin-top: 20px;
      list-style-type: disc;
      padding-left: 20px;
    }
  
    li {
      color: #2c3e50;
      font-size: 1em;
      margin-bottom: 5px;
    }
  </style>
  
  <div class="main-content">
    <h2>Dashboard</h2>
    <p>{content}</p>
    <ul>
      {#each tab as item}
        <li>{item}</li>
      {/each}
    </ul>
  </div>
  