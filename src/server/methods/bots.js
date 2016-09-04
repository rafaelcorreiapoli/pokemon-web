import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check'

import Eggs from '@collections/eggs'
import Bots from '@collections/bots'
import Encounters from '@collections/encounters'
import Gyms from '@collections/gyms'
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
  return bot
}
const checkIsLoggedIn = () => {
  const userId = Meteor.userId()
  if (userId) {
    return userId
  }
  throw new Meteor.Error('not-authorized')
}
const botServiceSyncCall = Meteor.wrapAsync(BotService.call, BotService)

Meteor.methods({
  'bots.run'({ botId }) {
    const userId = checkIsLoggedIn()
    validateBot(botId, userId)
    Bots.update(botId, {
      $set: {
        currentEncounter: null,
      },
    })
  },
  'bots.selectBot'({ botId }) {
    const userId = checkIsLoggedIn()
    validateBot(botId, userId)
    Bots.update({
      _id: {
        $ne: botId,
      },
      userId,
    }, {
      $set: {
        selected: false,
      },
    }, {
      multi: true,
    })
    Bots.update(botId, {
      $set: {
        selected: true,
      },
    })
  },
  'bots.changeAngle'({ botId, direction }) {
    const userId = checkIsLoggedIn()
    validateBot(botId, userId)
    const bot = Bots.findOne(botId)
    let { angle } = bot
    if (isNaN(angle)) angle = 0
    let newAngle

    if (direction === 1) {
      const normalizedAngle = (angle - 360 / 36) % 360
      newAngle = normalizedAngle < 0 ? 360 + normalizedAngle : normalizedAngle
    } else if (direction === -1) {
      newAngle = (angle + 360 / 36) % 360
    }
    if (angle !== newAngle) {
      Bots.update(botId, {
        $set: {
          angle: newAngle,
        },
      })
    }
  },
  'bots.walk'({ botId, direction }) {
    const userId = checkIsLoggedIn()
    const bot = validateBot(botId, userId)
    const { angle, coords: { latitude, longitude } } = bot
    const dLat = Math.sin((angle + 90) / 180 * Math.PI) * 0.0005 * direction
    const dLng = Math.cos((angle + 90) / 180 * Math.PI) * 0.0005 * direction

    const newLatitude = latitude + dLat
    const newLongitude = longitude + dLng
    Bots.update(botId, {
      $set: {
        coords: {
          latitude: newLatitude,
          longitude: newLongitude,
        },
      },
    })

    Meteor.call('bots.setPosition', {
      botId,
      latitude: newLatitude,
      longitude: newLongitude,
    })
  },
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
      angle: 0,
    })
  },
  'bots.encounterPokemon'({ botId, encounterIdNumber }) {
    this.unblock();

    check(encounterIdNumber, String)
    const userId = checkIsLoggedIn()
    const { token } = validateBot(botId, userId)
    const encounter = Encounters.findOne(encounterIdNumber)
    const { encounterId, spawnPointId } = encounter

    // Optimistic UI
    Bots.update(botId, {
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
      Bots.update(botId, {
        $set: {
          currentEncounterCP: encounterPokemon.cp,
        },
      })
      return encounterPokemon
    } catch (error) {
      throw new Meteor.Error(error.reason)
    }
  },
  'bots.catchPokemon'({ botId, encounterIdNumber }) {
    check(encounterIdNumber, String)
    const userId = checkIsLoggedIn()
    const { token } = validateBot(botId, userId)

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
        })
        Meteor.call('bots.refreshInventory', {
          botId
        })
      } else if (catchPokemon === 0 || catchPokemon === 3) {
        Bots.update(botId, {
          $addToSet: {
            fleedEncounters: encounterIdNumber,
          },
        })
        return catchPokemon
      }
    } catch (error) {
      throw new Meteor.Error(error.reason)
    }
  },
  'bots.refreshInventory'({ botId }) {
    const userId = checkIsLoggedIn()
    const { token } = validateBot(botId, userId)

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
      throw new Meteor.Error(error.reason)
    }
  },
  'bots.evolvePokemon'({ botId, pokemonId }) {
    //  TODO: Solve integer 64 issues
    check(pokemonId, String)

    const userId = checkIsLoggedIn()
    const { token } = validateBot(botId, userId)

    try {
      const evolvePokemon = botServiceSyncCall('evolvePokemon', {
        token,
        pokemonId,
      })

      return evolvePokemon
    } catch (error) {
      throw new Meteor.Error(error.reason)
    }
  },
  'bots.dropItem'({ botId, itemId, count }) {
    check(itemId, Number)
    check(count, Number)

    const userId = checkIsLoggedIn()
    const { token } = validateBot(botId, userId)

    try {
      const dropItem = botServiceSyncCall('transferPokemon', {
        token,
        itemId,
        count,
      })

      return dropItem
    } catch (error) {
      throw new Meteor.Error(error.reason)
    }
  },
  'bots.transferPokemon'({ botId, pokemonIdNumber }) {
    check(pokemonIdNumber, String)

    const userId = checkIsLoggedIn()
    const { token } = validateBot(botId, userId)

    const pokemon = Pokemons.findOne(pokemonIdNumber)
    const { pokemonId } = pokemon
    try {
      const transferPokemon = botServiceSyncCall('transferPokemon', {
        token,
        pokemonId,
      })
      if (transferPokemon.Status === 1) {
        Pokemons.remove({
          _id: pokemonIdNumber
        })
      }
      return transferPokemon
    } catch (error) {
      console.log(error)
      throw new Meteor.Error(error.reason)
    }
  },
  'bots.getPokestop'({ botId, pokestopId }) {
    check(pokestopId, String)

    const userId = checkIsLoggedIn()
    const { token } = validateBot(botId, userId)
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
      console.log(error)
      throw new Meteor.Error(error.reason)
    }
  },
  'bots.setPosition'({ botId, latitude, longitude }) {
    this.unblock();

    check(latitude, Number)
    check(longitude, Number)
    const userId = checkIsLoggedIn()
    const { token } = validateBot(botId, userId)

    //  TODO: Optimistic UI
    Bots.update(botId, {
      $set: {
        coords: {
          latitude,
          longitude,
        },
      },
    })

    try {
      const scan = botServiceSyncCall('setPosition', {
        token,
        latitude,
        longitude,
      })

      scan.encounters && scan.encounters.forEach(({ encounterIdNumber, ...encounter }) => {
        Encounters.upsert({
          _id: encounterIdNumber,
        }, {
          $set: {
            _id: encounterIdNumber,
            ...encounter,
          },
        })
      })

      scan.pokestops && scan.pokestops.forEach(({ pokestopId, ...pokestop }) => {
        Pokestops.upsert({
          _id: pokestopId,
        }, {
          $set: {
            _id: pokestopId,
            ...pokestop,
          },
        })
      })

      scan.gyms && scan.gyms.forEach(({ gymId, ...gym }) => {
        Gyms.upsert({
          _id: gymId,
        }, {
          $set: {
            _id: gymId,
            ...gym,
          },
        })
      })
    } catch (error) {
      throw new Meteor.Error(error.reason)
    }
  },
  'bots.refreshProfile'({ botId }) {
    const userId = checkIsLoggedIn()
    const { token } = validateBot(botId, userId)

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
      throw new Meteor.Error(error.reason)
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

      Meteor.call('bots.refreshProfile', {
        botId,
      })

      Meteor.call('bots.refreshInventory', {
        botId,
      })

      return token
    } catch (error) {
      throw new Meteor.Error(error.reason)
    }
  },
})
