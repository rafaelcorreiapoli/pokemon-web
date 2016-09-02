import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check'

import Eggs from '@collections/eggs'
import Bots from '@collections/bots'
import Encounters from '@collections/encounters'
import Pokemons from '@collections/pokemons'
import Pokestops from '@collections/pokestops'
import pokemonsById from '@resources/pokemons'
import itemsById from '@resources/items'
import BotService from 'server/BotService'

const BOT_STATUS_IDLE = 0;
const BOT_STATUS_LOGGING_IN = 1;
const BOT_STATUS_LOGGED_IN = 2;
const BOT_STATUS_PATROLLING = 3;
const BOT_STATUS_ERROR = 4;

console.log('registering methods')
const botServiceSyncCall = Meteor.wrapAsync(BotService.call)

Meteor.methods({
  'bots.registerBot'({ email, password, nickname, coords, proxy }) {
    check(email, String)
    check(nickname, String)
    check(password, String)
    check(proxy, Match.isOptional(String))
    console.log(`Registering new bot: ${email} / ${password} at
      [ ${coords.latitude}, ${coords.longitude} ]`)
    return Bots.insert({
      loggedIn: false,
      status: BOT_STATUS_IDLE,
      coords,
      email,
      nickname,
      password,
    })
  },
  'bots.encounterPokemon'({ botId, encounterIdNumber }) {
    check(botId, String)
    check(encounterIdNumber, String)

    const bot = Bots.findOne(botId)
    const { token } = bot
    const encounter = Encounters.findOne(encounterIdNumber)
    const { encounterId, spawnPointId } = encounter

    // Optimistic UI
    Bots.update(this.botId, {
      $set: {
        currentEncounter: encounterIdNumber,
      },
    })

    try {
      const encounterPokemon = botServiceSyncCall('encounterPokemon', {
        token,
        encounterId,
        spawnPointId,
      })

      // Resync Bots collection with the answer ( if different )

      return encounterPokemon
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
  'bots.catchPokemon'({ botId, encounterIdNumber }) {
    check(botId, String)
    check(encounterIdNumber, String)
    const encounter = Encounters.findOne(encounterIdNumber)
    const { encounterId, spawnPointId } = encounter
    const bot = Bots.findOne(botId)
    const { token } = bot

    try {
      const catchPokemon = botServiceSyncCall('catchPokemon', {
        token,
        encounterId,
        spawnPointId,
      })

      if (catchPokemon === 1) {
        Bots.update(botId, {
          $addToSet: {
            catchedEncounters: encounterIdNumber,
          },
          $set: {
            currentEncounter: null,
          },
        })
      }
      if (catchPokemon === 0 || catchPokemon === 3) {
        Bots.update(this.botId, {
          $addToSet: {
            fleedEncounters: encounterIdNumber,
          },
          $set: {
            currentEncounter: null,
          },
        })

        return catchPokemon
      }
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
  'bots.refreshInventory'({ botId }) {
    check(botId, String)
    const bot = Bots.findOne(botId)
    const { token } = bot

    try {
      const inventory = botServiceSyncCall('fetchInventory', {
        token,
      })
      const {
        level,
        uniquePokedex,
        items,
        candies,
        eggs,
        pokemons,
      } = inventory

      Bots.update(botId, {
        $set: {
          'pokemonGoProfile.level': level,
          'pokemonGoProfile.uniquePokedex': uniquePokedex,
          'pokemonGoProfile.items': items,
          'pokemonGoProfile.candies': candies,
        },
      })
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

      eggs.forEach(egg => {
        Eggs.upsert({
          _id: egg.eggIdNumber,
        }, {
          $set: {
            _id: egg.eggIdNumber,
            ...egg,
            botId,
          },
        })
      })
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
  'bots.evolvePokemon'({ botId, pokemonId }) {
    //  TODO: Solve integer 64 issues
    check(botId, String)
    check(pokemonId, String)
    const bot = Bots.findOne(botId)
    const { token } = bot

    try {
      const evolvePokemon = botServiceSyncCall('evolvePokemon', {
        token,
        pokemonId,
      })

      return evolvePokemon
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
  'bots.dropItem'({ botId, itemId, count }) {
    check(botId, String)
    check(itemId, Number)
    check(count, Number)
    const bot = Bots.findOne(botId)
    const { token } = bot

    try {
      const dropItem = botServiceSyncCall('transferPokemon', {
        token,
        itemId,
        count,
      })

      return dropItem
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
  'bots.transferPokemon'({ botId, pokemonIdNumber }) {
    check(botId, String)
    check(pokemonIdNumber, String)
    const pokemon = Pokemons.findOne(pokemonIdNumber)
    const { pokemonId } = pokemon
    const bot = Bots.findOne(botId)
    const { token } = bot
    try {
      const transferPokemon = botServiceSyncCall('transferPokemon', {
        token,
        pokemonId,
      })

      return transferPokemon
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
  'bots.getPokestop'({ botId, pokestopId }) {
    check(botId, String)
    check(pokestopId, String)

    const bot = Bots.findOne(botId)
    const { token } = bot
    const pokestop = Pokestops.findOne(pokestopId)
    const { latitude, longitude } = pokestop
    try {
      const getPokestop = botServiceSyncCall('getPokestop', {
        token,
        pokestopId,
        latitude,
        longitude,
      })

      return getPokestop
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
  'bots.setPosition'({ botId, latitude, longitude }) {
    check(botId, String)
    check(latitude, Number)
    check(longitude, Number)
    const bot = Bots.findOne(botId)
    const { token } = bot

    //  TODO: Optimistic UI
    try {
      const coords = botServiceSyncCall('setPosition', {
        token,
        latitude,
        longitude,
      })
      console.log(coords)
      Bots.update(botId, {
        $set: {
          coords: {
            latitude,
            longitude,
          },
        },
      })
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
  'bots.refreshProfile'({ botId }) {
    check(botId, String)
    const bot = Bots.findOne(botId)
    const { token } = bot

    try {
      const profile = botServiceSyncCall('fetchProfile', { token })
      Bots.update(botId, {
        $set: {
          'pokemonGoProfile.pokeStorage': profile.pokeStorage,
          'pokemonGoProfile.itemStorage': profile.itemStorage,
          'pokemonGoProfile.team': profile.team,
          'pokemonGoProfile.username': profile.username,
          'pokemonGoProfile.avatar': profile.avatar,
          'pokemonGoProfile.pokecoin': profile.pokecoin,
          'pokemonGoProfile.stardust': profile.stardust,
        },
      })
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
  'bots.login'({ botId }) {
    check(botId, String)
    const bot = Bots.findOne(botId)
    const { email, password, coords } = bot;

    try {
      const apiToken = botServiceSyncCall('login', {
        email: 'poke.zumbi.001@gmail.com',
        password: 'POLIq1w2e3$',
        coords: {
          latitude: 10,
          longitude: 20,
        },
      })
      Bots.update(botId, {
        $set: {
          apiToken,
        },
      })
      return apiToken
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
})
