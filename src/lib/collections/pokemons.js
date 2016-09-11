import { Mongo } from 'meteor/mongo'
const Pokemons = new Mongo.Collection('pokemons')
Pokemons.static = {}
Pokemons.static.proccessPokemons = (botId, pokemons) => {
  pokemons.forEach(pokemon => {
    Pokemons.upsert({
      _id: pokemon.pokemonIdNumber,
    }, {
      $set: {
        _id: pokemon.pokemonIdNumber,
        ...pokemon,
        botId,
      },
    })
  })
}
export default Pokemons
