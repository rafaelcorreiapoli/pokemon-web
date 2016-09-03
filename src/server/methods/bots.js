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

const validateBot = (botId, userId) => {
  check(botId, String)
  const bot = Bots.findOne(botId)
  if (bot.userId !== userId) throw new Meteor.Error('not-bot-owner')
  return bot.token
}
const checkIsLoggedIn = () => {
  const userId = Meteor.userId()
  if (userId) {
    return userId
  }
  throw new Meteor.Error('not-authorized')
}
console.log('registering methods')
const botServiceSyncCall = Meteor.wrapAsync(BotService.call, BotService)

Meteor.methods({
  'bots.registerBot'({ email, password, nickname, coords, proxy }) {
    const userId = checkIsLoggedIn()
    check(email, String)
    check(nickname, String)
    check(password, String)
    check(proxy, Match.Optional(String))

    return Bots.insert({
      loggedIn: false,
      status: BOT_STATUS_IDLE,
      coords,
      email,
      nickname,
      password,
      userId,
    })
  },
  'bots.encounterPokemon'({ botId, encounterIdNumber }) {
    check(encounterIdNumber, String)
    const userId = checkIsLoggedIn()
    const token = validateBot(botId, userId)
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
    check(encounterIdNumber, String)
    const userId = checkIsLoggedIn()
    const token = validateBot(botId, userId)

    const encounter = Encounters.findOne(encounterIdNumber)
    const { encounterId, spawnPointId } = encounter

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
    const userId = checkIsLoggedIn()
    const token = validateBot(botId, userId)

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
      console.log(pokemons)
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
    check(pokemonId, String)

    const userId = checkIsLoggedIn()
    const token = validateBot(botId, userId)

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
    check(itemId, Number)
    check(count, Number)

    const userId = checkIsLoggedIn()
    const token = validateBot(botId, userId)

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
    check(pokemonIdNumber, String)

    const userId = checkIsLoggedIn()
    const token = validateBot(botId, userId)

    const pokemon = Pokemons.findOne(pokemonIdNumber)
    const { pokemonId } = pokemon
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
    check(pokestopId, String)

    const userId = checkIsLoggedIn()
    const token = validateBot(botId, userId)
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
    check(latitude, Number)
    check(longitude, Number)
    const userId = checkIsLoggedIn()
    const token = validateBot(botId, userId)

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
    const userId = checkIsLoggedIn()
    const token = validateBot(botId, userId)

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
    const userId = checkIsLoggedIn()

    const bot = Bots.findOne(botId)
    if (!bot) throw new Meteor.Error('bot-not-found')
    if (bot.userId !== userId) throw new Meteor.Error('not-bot-owner')

    const { email, password, coords } = bot;

    try {
      const token = botServiceSyncCall('login', {
        email,
        password,
        coords,
      })
      Bots.update(botId, {
        $set: {
          token,
        },
      })
      return token
    } catch (error) {
      throw new Meteor.Error(error)
    }
  },
})
