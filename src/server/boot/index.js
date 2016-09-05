import { Meteor } from 'meteor/meteor'
import Encounters from '@collections/encounters'
import pokemonsById from '@resources/pokemons'
import Pokesnipers from '@collections/pokesnipers'
import Pokestops from '@collections/pokestops'

import moment from 'moment'

import { HTTP } from 'meteor/http'
Meteor.startup(() => {
  Encounters.remove({
    expirationDate: {
      $lte: new Date(),
    },
  }, {
    multi: true,
  })

  Pokestops._ensureIndex({ 'loc': '2dsphere' });

  Meteor.setInterval(() => {
    HTTP.get('https://pokesnipers.com/api/v1/pokemon.json', (err, res) => {
      if (err) {
        console.log(err)
        return;
      }
      res.data.results.forEach(pokemon => {
        const coords = pokemon.coords.split(',')
        const latitude = Number(coords[0])
        const longitude = Number(coords[1])

        const pokedexNumber = Number(Object.keys(pokemonsById).find(key => {
          return pokemon.name.toLowerCase().trim() === pokemonsById[key].name.toLowerCase().trim()
        }))
        const expirationDate = moment(pokemon.until).toDate()
        const iv = pokemon.iv
        const rarity = pokemon.rarity

        Pokesnipers.upsert({
          _id: String(pokemon.id),
        }, {
          $set: {
            _id: String(pokemon.id),
            latitude,
            longitude,
            pokedexNumber,
            expirationDate,
            iv,
            rarity,
          },
        })
      })
    })
  }, 5000)
})
