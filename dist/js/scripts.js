let pokemonRepository = (function () {
  let pokemonList = [];

  function fetchData(url) {
    return fetch(url).then((response) => response.json());
  }

  function showLoadingMessage() {
    let loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.textContent = "Loading...";
  }

  function hideLoadingMessage() {
    let loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.textContent = "";
  }

  function loadPokemonDetails(pokemon) {
    showLoadingMessage();
    return fetchData(pokemon.detailsUrl)
      .then((details) => {
        pokemon.imgUrl = details.sprites.front_default;
        pokemon.height = details.height;
        hideLoadingMessage();
        return pokemon;
      })
      .catch((error) => {
        console.error(error);
        hideLoadingMessage();
      });
  }

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    if (typeof pokemon === "object") {
      pokemonList.push(pokemon);
    } else {
      console.error("Error: Only objects can be added to the pokemonList.");
    }
  }

  function showPokemonDetails(pokemon) {
    console.log("Showing details for:", pokemon.name);
    loadPokemonDetails(pokemon).then((pokemon) => {
      let modalTitle = document.getElementById("modalTitle");
      let modalText = document.getElementById("modalText");
      let modalImg = document.getElementById("modalImg");

      modalTitle.innerText = capitalizeFirstLetter(pokemon.name);
      modalText.innerText = `Height: ${pokemon.height / 10} m`;
      modalImg.setAttribute("src", pokemon.imgUrl);

      $("#pokemonModal").modal("show");
    });
  }

  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector("#pokemonList");
    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item");

    let button = document.createElement("button");
    button.innerText = capitalizeFirstLetter(pokemon.name);
    button.classList.add("pokemon-button");
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#pokemonModal");

    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);

    button.addEventListener("click", function () {
      showPokemonDetails(pokemon);
    });
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function loadPokemonList() {
    showLoadingMessage();
    return fetchData("https://pokeapi.co/api/v2/pokemon/?limit=150")
      .then((response) => {
        response.results.forEach((pokemon) => {
          add({ name: pokemon.name, detailsUrl: pokemon.url });
        });
        hideLoadingMessage();
      })
      .catch((error) => {
        console.error(error);
        hideLoadingMessage();
      });
  }

  function filterPokemonList() {
    let searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("keyup", () => {
      let searchText = searchBar.value.toLowerCase();
      let filteredPokemon = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchText)
      );
      renderPokemonList(filteredPokemon);
    });
  }

  function renderPokemonList(pokemonList) {
    let pokemonListElement = document.querySelector("#pokemonList");
    pokemonListElement.innerHTML = "";

    pokemonList.forEach((pokemon) => {
      addListItem(pokemon);
    });
  }

  return {
    getAll: getAll,
    add: add,
    filterPokemonList: filterPokemonList,
    addListItem: addListItem,
    loadList: function () {
      return loadPokemonList();
    },
    loadDetails: function (pokemon) {
      return loadPokemonDetails(pokemon);
    },
    showDetails: function (pokemon) {
      return showPokemonDetails(pokemon);
    },
  };
})();

pokemonRepository
  .loadList()
  .then(() => {
    let pokemonPromises = pokemonRepository
      .getAll()
      .map((pokemon) => pokemonRepository.loadDetails(pokemon));
    return Promise.all(pokemonPromises);
  })
  .then(() => {
    pokemonRepository.getAll().forEach((pokemon) => {
      pokemonRepository.addListItem(pokemon);
    });
  })
  .catch((error) => console.error(error));

pokemonRepository.filterPokemonList();
