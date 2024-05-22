// scripts.js

let pokemonList = [
    {
        name: "Azumarill",
        height: 0.8,
        types: ['fairy', 'water']
    },
    {
        name: "Charmander",
        height: 0.6,
        types: ['fire']
    },
    {
        name: "Charizard",
        height: 1.7,
        types: ['fire', 'flying']
    },
    {
        name: "Sandslash",
        height: 1,
        types: ['ground']
    },
    {
        name: "Charmeleon",
        height: 1.1,
        types: ['fire']
    }
];

// Iterate over each Pokémon in the pokemonList array
for (let i = 0; i < pokemonList.length; i++) {
        // Check if the Pokémon's height is above 1.5
    if (pokemonList[i].height > 1.5) {
        // If the height is greater than 1.5, add a special note 
        document.write(pokemonList[i].name + " (height: " + pokemonList[i].height + "m) - Wow, that's big!<br>");
    } else {
        // Otherwise, just display the Pokémon's name and height
        document.write(pokemonList[i].name + " (height: " + pokemonList[i].height + "m)<br>");
    }
}