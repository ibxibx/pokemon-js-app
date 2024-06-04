let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // Function to return all items
  function getAll() {
      return pokemonList;
  }

  // Function to add a single item to the pokemonList array
  function add(item) {
      // Check if the parameter is an object
      if (typeof item === 'object') {
          // If it's an object, push it to the pokemonList array
          pokemonList.push(item);
      } else {
          // If it's not an object, log an error message
          console.error("Error: Only objects can be added to the pokemonList.");
      }
  }

  // Function to display the Pokémon details
  function displayPokemonDetails(pokemon) {
      const pokemonDetailsElement = document.getElementById('pokemonDetails');
      document.getElementById('pokemonName').textContent = pokemon.name;
      document.getElementById('pokemonImage').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonList.indexOf(pokemon) + 1}.png`;
      document.getElementById('pokemonDescription').textContent = pokemon.description;
      pokemonDetailsElement.style.display = 'block';
  }

  // Function to filter the Pokémon list based on search input
  function filterPokemonList() {
      const searchBar = document.getElementById('searchBar');
      searchBar.addEventListener('keyup', () => {
          const searchText = searchBar.value.toLowerCase();
          const filteredPokemon = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchText));
          // Use the custom forEach loop to display the filtered list
          displayPokemonList(filteredPokemon);
      });
  }

  // Function to create and append a list item for a Pokémon button
  function addListItem(pokemon) {
      // Select the UL element where the Pokémon list will be displayed
      let pokemonListElement = document.querySelector('#pokemonList');

      // Create a list item for each Pokémon
      let listItem = document.createElement('li');

      // Create a button for each Pokémon
      let button = document.createElement('button');
      button.innerText = pokemon.name;

      // Add a class to the button
      button.classList.add('pokemon-button');

      // Append the button to the list item
      listItem.appendChild(button);

      // Append the list item to the UL element
      pokemonListElement.appendChild(listItem);

      // Add a click event to display Pokémon details and log to the console
      button.addEventListener('click', () => {
          displayPokemonDetails(pokemon);
          console.log(pokemon);  // Log the Pokémon object to the console
      });
  }

  // Function to load the list of Pokémon from the API
  function loadList() {
      return fetch(apiUrl).then(function (response) {
          return response.json();
      }).then(function (json) {
          json.results.forEach(function (item) {
              let pokemon = {
                  name: item.name,
                  detailsUrl: item.url
              };
              add(pokemon);
          });
      }).catch(function (e) {
          console.error(e);
      });
  }

  return {
      getAll: getAll,
      add: add,
      displayPokemonDetails: displayPokemonDetails,
      filterPokemonList: filterPokemonList,
      addListItem: addListItem,
      loadList: loadList
  };
})();

// Load the list of Pokémon and add them to the repository
pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon) {
      pokemonRepository.addListItem(pokemon);
  });
});

// Set up the search filter
pokemonRepository.filterPokemonList();
