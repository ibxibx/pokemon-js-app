let pokemonRepository = (function () {
    // Array of Pokémon objects
    let pokemonList = [
        { name: "Azumarill", height: 0.8, types: ['fairy', 'water'], description: "Azumarill is a blue, bipedal Pokémon that has an ovoid body." },
        { name: "Charmander", height: 0.6, types: ['fire'], description: "Charmander is a bipedal, reptilian Pokémon with a primarily orange body and blue eyes." },
        { name: "Charizard", height: 1.7, types: ['fire', 'flying'], description: "Charizard is a draconic, bipedal Pokémon." },
        { name: "Sandslash", height: 1, types: ['ground'], description: "Sandslash is a bipedal, ground-dwelling pholidote Pokémon." },
        { name: "Charmeleon", height: 1.1, types: ['fire'], description: "Charmeleon is a bipedal, reptilian Pokémon with a primarily orange body." }
    ];

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

    // Return an object containing only the required public functions
    return {
        getAll: getAll,
        add: add,
        displayPokemonDetails: displayPokemonDetails,
        filterPokemonList: filterPokemonList
    };
})();

// Iterate over each Pokémon in the repository using forEach and getAll functions
pokemonRepository.getAll().forEach(pokemon => {
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

    // Add a click event to display Pokémon details
    button.addEventListener('click', () => {
        pokemonRepository.displayPokemonDetails(pokemon);
    });
});

// Set up the search filter
pokemonRepository.filterPokemonList();

    // Check if the Pokémon's height is above a certain value (e.g., 1.0 meters)
    // if (pokemon.height > 1.0) {
    // If the height is greater than 1.0, add the special note "Wow, that's big!"
    // document.write(pokemon.name + " (height: " + pokemon.height + ") - Wow, that's big!<br>");
    // } else {
    // Otherwise, just display the Pokémon's name and height
    // document.write(pokemon.name + " (height: " + pokemon.height + ")<br>");
    // }
