let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function loadDataFromExternalSource(url) {
    return fetch(url).then(response => response.json());
  }

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

  function getAll() {
    return pokemonList;
  }

  function add(item) {
    if (typeof item === 'object') {
      pokemonList.push(item);
    } else {
      console.error("Error: Only objects can be added to the pokemonList.");
    }
  }

  function showDetails(pokemon) {
    console.log('Showing details for:', pokemon.name);
    loadDetails(pokemon).then(function (updatedPokemon) {
      showModal(updatedPokemon.name, `Height: ${updatedPokemon.height / 10} m`, updatedPokemon.imgUrl);
    });
  }

  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector('#pokemonList');
    let listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    let button = document.createElement('button');
    button.innerText = capitalizeFirstLetter(pokemon.name);
    button.classList.add('btn', 'btn-primary', 'pokemon-button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#pokemonModal');
    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);

    button.addEventListener('click', () => {
      showDetails(pokemon);
    });
  }

  function filterPokemonList() {
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('keyup', () => {
      const searchText = searchBar.value.toLowerCase();
      const filteredPokemon = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(searchText));
      displayPokemonList(filteredPokemon);
    });
  }

  function displayPokemonList(pokemonList) {
    const pokemonListElement = document.querySelector('#pokemonList');
    pokemonListElement.innerHTML = '';
    pokemonList.forEach(pokemon => {
      addListItem(pokemon);
    });
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function showModal(title, text, img) {
    console.log('Showing modal for:', title);

    document.getElementById('modalTitle').innerText = capitalizeFirstLetter(title);
    document.getElementById('modalText').innerText = text;
    document.getElementById('modalImg').setAttribute('src', img);

    $('#pokemonModal').modal('show');
  }

  return {
    getAll: getAll,
    add: add,
    filterPokemonList: filterPokemonList,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };
})();

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

pokemonRepository.filterPokemonList();