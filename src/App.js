import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import PokemonInfo from './PokemonInfo';

const pokeballImage = "https://upload.wikimedia.org/wikipedia/commons/5/51/Pokebola-pokeball-png-0.png"

const ALL_POKEMON_QUERY = gql`
query {
  pokemons(first:150) {
    id
  }
}
`

const GET_POKEMON_QUERY = gql`
  query getPokemon($id: String!) {
    pokemon(id: $id) {
      name,
      classification,
      types,
      resistant,
      weaknesses,
      fleeRate,
      image
    }
  }
`

function App() {
  const {loading, error, data} = useQuery(ALL_POKEMON_QUERY)
  const [getPokemon, {loading: loadingPokemon, error: pokemonError, data: currentPokemonData }] = useLazyQuery(GET_POKEMON_QUERY)

  const results = useLazyQuery(GET_POKEMON_QUERY)
  const handleClick = (id) => {
    getPokemon({
      variables: { id }
    })
  }
  if(loading) {
    return <p>Loading - so excite!</p>
  }
  else if(error) {
    throw new Error(error)
  }
  else {
    let pokeballs = []
    if(data.pokemons) {
      pokeballs = data.pokemons.map(pokemon => {
        return <li key={pokemon.id}>
          <img 
            width="75" 
            src={pokeballImage} 
            alt="Mystery Pokeball" 
            onClick={() => { handleClick(pokemon.id) }} />
        </li>
      })
    }

    let currentPokemonDisplay
    if(currentPokemonData && currentPokemonData.pokemon) {
      //display pokemon
      currentPokemonDisplay = <PokemonInfo {...currentPokemonData.pokemon} />
    }

    return <div>
      <h1>Pokemon Info</h1>
      <ul>
        {pokeballs}
      </ul>
      {currentPokemonDisplay}
    </div>
  }
}

export default App;
