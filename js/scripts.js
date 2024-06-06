let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  let modalContainer = document.querySelector('#modal-container');

  // Function to load data from an external source
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

  // Function to show the loading message
  function showLoadingMessage() {
    const loadingMessageElement = document.getElementById('loadingMessage');
    loadingMessageElement.textContent = 'Loading...';
  }

  // Function to hide the loading message
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
    if (typeof item === 'object') {
      pokemonList.push(item);
    } else {
      console.error("Error: Only objects can be added to the pokemonList.");
    }
  }

  // Function to display the Pokémon details in a modal
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon.name, `Height: ${pokemon.height / 10} m`, pokemon.imgUrl);
    });
  }

  // Function to display the Pokémon details in the detail section
  function displayPokemonDetails(pokemon) {
    const pokemonDetailsElement = document.getElementById('pokemonDetails');
    document.getElementById('pokemonName').textContent = capitalizeFirstLetter(pokemon.name);
    document.getElementById('pokemonImage').src = pokemon.imgUrl;
    document.getElementById('pokemonHeight').textContent = `Height: ${pokemon.height / 10} m`;
    pokemonDetailsElement.style.display = 'block';
  }

  // Function to create and append a list item for a Pokémon button
  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector('#pokemonList');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = capitalizeFirstLetter(pokemon.name);
    button.classList.add('pokemon-button');
    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);

    button.addEventListener('click', () => {
      showDetails(pokemon);
    });
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

  // Function to display the Pokémon list
  function displayPokemonList(pokemonList) {
    const pokemonListElement = document.querySelector('#pokemonList');
    pokemonListElement.innerHTML = '';
    pokemonList.forEach(pokemon => {
      addListItem(pokemon);
    });
  }

  // Function to capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Function to show the modal
  function showModal(title, text, img) {
    modalContainer.innerHTML = '';

    let modal = document.createElement('div');
    modal.classList.add('modal');

    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    let titleElement = document.createElement('h1');
    titleElement.innerText = capitalizeFirstLetter(title);

    let contentElement = document.createElement('p');
    contentElement.innerText = text;

    let imageElement = document.createElement('img');
    imageElement.setAttribute('src', img);
    imageElement.setAttribute('width', '304');
    imageElement.setAttribute('height', '228');
    imageElement.setAttribute('alt', `Image of ${title}`);

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modal.appendChild(imageElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add('is-visible');
  }

  // Function to hide the modal
  function hideModal() {
    modalContainer.classList.remove('is-visible');
  }

  // Event listeners to close the modal with ESC key and click outside the modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });

  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      hideModal();
    }
  });

  return {
    getAll: getAll,
    add: add,
    displayPokemonDetails: displayPokemonDetails,
    filterPokemonList: filterPokemonList,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };
})();

// Load the list of Pokémon and add them to the repository
pokemonRepository.loadList()
  .then(() => {
    const promises = pokemonRepository.getAll().map(pokemon => pokemonRepository.loadDetails(pokemon));
    return Promise.all(promises);
  })
  .then(() => {
    pokemonRepository.getAll().forEach(pokemon => {
      pokemonRepository.addListItem(pokemon);
    });
  })
  .catch(error => console.error(error));

// Set up the search filter
pokemonRepository.filterPokemonList();