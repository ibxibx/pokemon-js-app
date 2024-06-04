let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // Add function to load data from an external source
  function loadDataFromExternalSource(url) {
    return fetch(url).then(response => response.json());
  }

  // Function to load the complete list of Pokémon with Loading Status Message
  function loadList() {
    showLoadingMessage();
    return loadDataFromExternalSource(apiUrl)
      .then(data => {
        data.results.forEach(item => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
        hideLoadingMessage();
      })
      .catch(error => {
        console.error(error);
        hideLoadingMessage();
      });
  }

  function showLoadingMessage() {
    const loadingMessageElement = document.getElementById('loadingMessage');
    loadingMessageElement.textContent = 'Loading...';
  }

  function hideLoadingMessage() {
    const loadingMessageElement = document.getElementById('loadingMessage');
    loadingMessageElement.textContent = '';
  }

  // Function to load Pokémon details with Loading Status Message
  function loadDetails(pokemon) {
    showLoadingMessage();
    return loadDataFromExternalSource(pokemon.detailsUrl)
      .then(details => {
        pokemon.imgUrl = details.sprites.front_default;
        pokemon.height = details.height;
        hideLoadingMessage();
        return pokemon;
      })
      .catch(error => {
        console.error(error);
        hideLoadingMessage();
      });
  }

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
    document.getElementById('pokemonName').textContent = capitalizeFirstLetter(pokemon.name);
    document.getElementById('pokemonImage').src = pokemon.imgUrl;
    document.getElementById('pokemonHeight').textContent = `Height: ${pokemon.height / 10} m`;
    pokemonDetailsElement.style.display = 'block';
  }

  // Function to filter the Pokémon list based on search input
  function filterPokemonList() {
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('keyup', () => {
      const searchText = searchBar.value.toLowerCase();
      const filteredPokemon = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchText));
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
    button.innerText = capitalizeFirstLetter(pokemon.name);

    // Add a class to the button
    button.classList.add('pokemon-button');

    // Append the button to the list item
    listItem.appendChild(button);

    // Append the list item to the UL element
    pokemonListElement.appendChild(listItem);

    // Add a click event to display Pokémon details and log to the console
    button.addEventListener('click', () => {
      displayPokemonDetails(pokemon);
      console.log(pokemon); // Log the Pokémon object to the console
    });
  }

  // Helper function to capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Function to display the Pokémon list
  function displayPokemonList(pokemonList) {
    const pokemonListElement = document.querySelector('#pokemonList');
    pokemonListElement.innerHTML = '';

    pokemonList.forEach(pokemon => {
      addListItem(pokemon);
    });
  }

  return {
    getAll: getAll,
    add: add,
    displayPokemonDetails: displayPokemonDetails,
    filterPokemonList: filterPokemonList,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

// Load the list of Pokémon and add them to the repository
pokemonRepository.loadList()
  .then(() => {
    // Load details for each Pokémon
    const promises = pokemonRepository.getAll().map(pokemon => pokemonRepository.loadDetails(pokemon));
    return Promise.all(promises);
  })
  .then(() => {
    // Now the data is loaded!
    pokemonRepository.getAll().forEach(pokemon => {
      pokemonRepository.addListItem(pokemon);
    });
  })
  .catch(error => console.error(error));

// Set up the search filter
pokemonRepository.filterPokemonList();