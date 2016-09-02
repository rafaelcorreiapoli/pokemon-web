import Bot from './Bot'
import Bots from '@collections/bots'
import Encounters from '@collections/encounters'
import Pokestops from '@collections/pokestops'
import Eggs from '@collections/eggs'
import Pokemons from '@collections/pokemons'
import Gyms from '@collections/gyms'

export default class Overlord {
  constructor() {
    this.bots = {}
    this.printLog = true;
    this.printErrors = true;
  }
  recoverBots() {
    Bots.find().forEach(bot => {
      const botInstance = this.instantiateBot(bot._id)

      if (bot.loginStatus === 2) {
        botInstance.login()
      }
    })
  }

  log(what) {
    if (this.printLog) {
      console.log(`[o] ${what}`)
    }
  }

  logError(what) {
    if (this.printErrors) {
      console.error(`[x] ${what}`)
    }
  }

  instantiateBot(botId, proxy) {
    const bot = new Bot(botId, proxy)
    this.bots[botId] = bot;
    const botEmail = bot.email
    if (proxy) {
      this.log(`instantiating new bot ${botEmail} with proxy ${proxy}`)
    } else {
      this.log(`instantiating new bot ${botEmail} without proxy`)
    }

    bot.onPokestopFound = ({
      pokestopId,
      latitude,
      longitude,
    }) => {
      const pokestop = Pokestops.findOne(pokestopId)
      if (!pokestop) {
        Pokestops.insert({
          _id: pokestopId,
          latitude,
          longitude,
        })
      }
    }

    bot.onGymFound = (gym) => {

    }

    bot.onFetchInventory = ({
      eggs,
      pokemons,
    }) => {
      eggs.forEach(egg => {
        Eggs.upsert({
          _id: egg.idNumber,
        }, {
          $set: {
            _id: egg.idNumber,
            eggId: egg.id,
            walkedTarget: egg.egg_km_walked_target,
            walkedStart: egg.egg_km_walked_start,
            botId,
          },
        })
      })

      pokemons.forEach(pokemon => {
        Pokemons.upsert({
          _id: pokemon.idNumber,
        }, {
          $set: {
            _id: pokemon.idNumber,
            pokemonId: pokemon.id,
            pokedexId: pokemon.pokemon_id,
            cp: pokemon.cp,
            stamina: pokemon.stamina,
            staminaMax: pokemon.staminaMax,
            height: pokemon.height_m,
            weight: pokemon.weight_kg,
            attack: pokemon.individual_attack,
            defense: pokemon.individual_defense,
            moves: [pokemon.move_1, pokemon.move_2],
            botId,
          },
        })
      })

      // candies.forEach(candy => {
      //   Candies.upsert({
      //     botId,
      //     pokedexNumber: candy.pokedexNumber
      //   }, {
      //     $set: {
      //       botId,
      //       pokedexNumber: candy.pokedexNumber,
      //       count: candy.count
      //     }
      //   })
      // })
      //
      // items.forEach(item => {
      //   Items.upsert({
      //     botId,
      //     itemId: item.item_id
      //   }, {
      //     $set: {
      //       botId,
      //       itemId: item.item_id,
      //       count: item.count
      //     }
      //   })
      // })
    }

    bot.onPokemonFound = ({ encounterIdNumber, ...data }) => {
      const encounter = Encounters.findOne(String(encounterIdNumber))
      if (!encounter) {
        Encounters.insert({
          _id: String(encounterIdNumber),
          ...data,
        })
      }
    }
    return bot
  }

  getBot(botId) {
    if (this.bots[botId]) {
      return this.bots[botId]
    }
    console.error('Bot instance not found.')
  }
}
