// scripts.js

alert('Hello world');

var favoriteFood = 'Chicken';

// Use document.write() to display the value stored in favoriteFood
document.write('My favorite food is: ' + favoriteFood);


// Function to fetch Pokemon data from the PokeAPI
async function fetchPokemonData(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = await response.json();
        displayPokemonData(data);
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
    }
}

// Function to display Pokemon data on the webpage
function displayPokemonData(pokemon) {
    const pokemonInfoDiv = document.getElementById('pokemon-info');
    pokemonInfoDiv.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
    `;
}

// Fetch data for a specific Pokemon
fetchPokemonData('pikachu');