import geolib from 'geolib'
import moment from 'moment'
import PokemonGO from 'pokemon-go-node-api'
//const PokemonGO = () => {}
import { Bots } from '@collections/bots'
import { convertLongToNumber } from '../utils/long'
import pokemonsById from '@resources/pokemons'
import itemsById from '@resources/items'

const CATCH_STATUS = ['Unexpected error', 'Successful catch', 'Catch Escape', 'Catch Flee', 'Missed Catch'];

const LOGGED_OUT = 0
const LOGGING_IN = 1;
const LOGGED_IN = 2;
const AUTO_SCAN_INTERVAL = 60000;

export default class Bot {
  constructor(botId, proxy) {
    this.api = new PokemonGO.Pokeio(proxy);
    this.api.playerInfo.debug = false;
    this.botId = botId
    this.printLog = true
    const { email, password } = this.fetchBot()
    this.email = email
    this.password = password
  }
  fetchBot() {
    // const bot = Bots.findOne(this.botId)
    // const { email, password, coords, loginStatus, error } = bot
    //
    // this.email = email;
    // this.password = password;
    // this.coords = coords;
    // this.error = error;
    // this.loginStatus = loginStatus;

    return Bots.findOne(this.botId)
  }
  // save() {
  //   const { email, password, coords, botId, loginStatus} = this
  //   return Bots.update({
  //     _id: botId
  //   }, {
  //     $set: {
  //       email,
  //       password,
  //       coords,
  //       loginStatus
  //     }
  //   })
  // }

  log(what) {
    const { email } = this.fetchBot()
    if (this.printLog) {
      console.log(`[+] ${this.email}: ${what}`)
    }
  }
  logError(what) {
    if (this.printLog) {
      console.error(`[x] ${this.email}: ${what}`)
    }
  }

  static buildLocation(latitude, longitude) {
    return {
      type: 'coords',
      coords: {
        latitude,
        longitude,
        altitude: 0,
      },
    }
  }

  handleBotError(error) {
    console.log(JSON.stringify(error))
    this.logError(`${error.toString()}`)

    Bots.update(this.botId, {
      $set: {
        loginStatus: LOGGED_OUT,
        error,
      },
    })
  }

  extractCurrency(currency) {
    let pokecoin = 0
    let stardust = 0
    currency.forEach(cur => {
      switch (cur.type) {
        case 'POKECOIN':
          pokecoin = cur.amount
          break;
        case 'STARDUST':
          stardust = cur.amount
          break;
      }
    })

    return {
      pokecoin,
      stardust,
    }
  }
  refreshProfile() {
    this.log('refreshing profile')

    this.api.GetProfile(Meteor.bindEnvironment((error, profile) => {
      if (error) {
        this.handleBotError(error)
        return;
      }
      const { team, username, avatar, poke_storage, item_storage, currency } = profile
      const { pokecoin, stardust } = this.extractCurrency(currency)

      this.log('successfully fetched profile')
      Bots.update(this.botId, {
        $set: {
          'pokemonGoProfile.pokeStorage': poke_storage,
          'pokemonGoProfile.itemStorage': item_storage,
          'pokemonGoProfile.team': team,
          'pokemonGoProfile.username': username,
          'pokemonGoProfile.avatar': avatar,
          'pokemonGoProfile.pokecoin': pokecoin,
          'pokemonGoProfile.stardust': stardust,
        },
      })
    }))
  }

  login(newCoords = {}) {
    const { email, password, coords } = this.fetchBot()
    this.log('logging in')
    Bots.update(this.botId, {
      $set: {
        loginStatus: LOGGING_IN,
      },
    })

    const latitude = newCoords.latitude ? newCoords.latitude : coords.latitude;
    const longitude = newCoords.longitude ? newCoords.longitude : coords.longitude;
    const location = this.buildLocation(latitude, longitude)

    this.api.init(email, password, location, 'google', Meteor.bindEnvironment(error => {
      if (error) {
        this.handleBotError(error)
        return;
      }
      this.log('successfully logged in')
      Bots.update(this.botId, {
        $set: {
          loginStatus: LOGGED_IN,
        },
      })
      this.scan();
      Meteor.setTimeout(() => {
        this.fetchInventory();

        Meteor.setTimeout(() => {
          this.refreshProfile();
        }, 1000)
      }, 1000)
    }))
  }

  startSmartScan() {

  }
  setPosition(latitude, longitude) {
    this.log(`settings position: ${latitude}, ${longitude}`)
    const location = this.buildLocation(latitude, longitude)

    return new Promise((resolve, reject) => {
      this.api.SetLocation(location, Meteor.bindEnvironment((error, coords) => {
        if (error) {
          this.handleBotError(error)
          reject(error)
          return;
        }

        Bots.update(this.botId, {
          $set: {
            coords: {
              latitude,
              longitude,
            },
          },
        })
        resolve(coords)
      }))
    })
  }

  getDistanceFromBot(latitude, longitude) {
    const bot = this.fetchBot();
    const botLatitude = bot.coords.latitude;
    const botLongitude = bot.coords.longitude;
    return geolib.getDistance({
      latitude: botLatitude,
      longitude: botLongitude,
    }, {
      latitude,
      longitude,
    })
  }
  scan() {
    const { coords: { latitude, longitude } } = this.fetchBot();
    if (this.scanAgainTimer) {
      Meteor.clearTimeout(this.scanAgainTimer)
    }
    this.scanAgainTimer = Meteor.setTimeout(() => {
      this.scan()
    }, AUTO_SCAN_INTERVAL)

    this.log(`scanning area. auto scan in ${AUTO_SCAN_INTERVAL / 1000} secs`)
    this.api.Heartbeat(Meteor.bindEnvironment((error, res) => {
      if (error) {
        this.handleBotError(error)
        return;
      }

      for (let i = res.cells.length - 1; i >= 0; i--) {
        const mapPokemon = res.cells[i].MapPokemon || [];
        const forts = res.cells[i].Fort || []
        forts.forEach(fort => {
          const fortLatitude = fort.Latitude
          const fortLongitude = fort.Longitude

          if (fort.FortType === 1) {
            // Pokestops
            // this.log(`scanned a pokestop ${distance} meters away`)
            this.onPokestopFound && this.onPokestopFound({
              pokestopId: fort.FortId,
              latitude: fortLatitude,
              longitude: fortLongitude,
            })
          } else if (fort.FortType === 0) {
            // Gyms
            // this.log(`scanned a gym ${distance} meters away`)
            this.onGymFound && this.onGymFound({
              gymId: fort.FortId,
              latitude,
              longitude,
            })
          }
        })

        mapPokemon.forEach(pokemon => {
          const pokedexNumber = pokemon.PokedexTypeId;
          const pokemonLatitude = pokemon.Latitude;
          const pokemonLongitude = pokemon.Longitude;
          const spawnPointId = pokemon.SpawnPointId
          const encounterId = pokemon.EncounterId
          const encounterIdNumber = convertLongToNumber(pokemon.EncounterId)
          const expirationTimeMs = convertLongToNumber(pokemon.ExpirationTimeMs)
          const pokedexInfo = pokemonsById[pokedexNumber]
          const distance = this.getDistanceFromBot(latitude, longitude)

          this.log(`scanned a pokemon ${pokedexInfo.name} ${distance} meters away`)
          this.onPokemonFound({
            botId: this.botId,
            expirationDate: moment(expirationTimeMs).toDate(),
            latitude: pokemonLatitude,
            longitude: pokemonLongitude,
            pokedexNumber,
            spawnPointId,
            encounterId,
            encounterIdNumber,
            expirationTimeMs,
          })
        })
      }
    }));
  }

  buildCatchablePokemon(encounterId, spawnPointId) {
    return {
      EncounterId: encounterId,
      SpawnPointId: spawnPointId,
    }
  }

  catchPokemon(encounterIdNumber, encounterId, spawnPointId) {
    const catchablePokemon = this.buildCatchablePokemon(encounterId, spawnPointId)
    this.api.CatchPokemon(catchablePokemon, 1, 1.950, 1, 1, Meteor.bindEnvironment((suc, dat) => {
      console.log(suc)
      console.log(dat)

      if (dat) {
        const status = dat.Status || 0
        this.log(`[+] catch result: ${CATCH_STATUS[status]}`);
        if (status === 1) {
          Bots.update(this.botId, {
            $addToSet: {
              catchedEncounters: encounterIdNumber,
            },
            $set: {
              currentEncounter: null,
            },
          })
        }
        if (status === 0 || status === 3) {
          Bots.update(this.botId, {
            $addToSet: {
              fleedEncounters: encounterIdNumber,
            },
            $set: {
              currentEncounter: null,
            },
          })
        }
      }
    }));
  }

  transferPokemon(pokemonId) {
    this.log(`transfering ${pokemonId}`)
    this.api.TransferPokemon(pokemonId, Meteor.bindEnvironment((error, res) => {
      if (error) {
        this.handleBotError(error)
        return;
      }
      console.log(res)
      this.log('successfuly transfered pokemon')
    }))
  }
  encounter(encounterIdNumber, encounterId, spawnPointId) {
    const catchablePokemon = this.buildCatchablePokemon(encounterId, spawnPointId)
    return new Promise((reject, resolve) => {
      this.api.EncounterPokemon(catchablePokemon, Meteor.bindEnvironment((error, res) => {
        if (res) {
          const encounterStatus = res.EncounterStatus
          this.log(`encountered pokemon. encounter status: ${encounterStatus}.`)
          return resolve(res)
        }
        this.handleBotError(error)
        reject(error)
      }));
    })
  }
  getPokestop(pokestopId, latitude, longitude) {
    const distance = this.getDistanceFromBot(latitude, longitude)
    if (distance < 40) {
      this.log(`pokestop is ${distance} away. can get it`)

      this.api.GetFort(pokestopId, latitude, longitude, Meteor.bindEnvironment((error, res) => {
        if (error) {
          this.handleBotError(error)
          return;
        }
        if (res) {
            // 1 = success
            // 2 = out of range ..
            // 3 = used
          if (res.result === 1) {
            this.log('success getting pokestop')
            this.log('items acquired:')
            res.items_awarded.forEach(item => {
              this.log(`  ${itemsById[item.item_id]}`)
            })
          } else if (res.result === 2) {
            this.log('pokestop is out of range.')
          } else if (res.result === 3) {
            this.log('pokestop is used')
          }
        }
      }));
    } else {
      this.log(`pokestop is too far away. ${distance} away.`)
    }
  }

  dropItem(itemId, count) {
    this.log(`dropping ${itemId} (${count})`)
    this.api.DropItem(itemId, count, Meteor.bindEnvironment((error, res) => {
      if (error) {
        this.handleBotError(error)
        return;
      }

      this.log('successfully dropped item(s)')
    }))
  }

  fetchInventory() {
    this.log('fetching inventory')
    this.api.GetInventory(Meteor.bindEnvironment((error, res) => {
      if (error) {
        this.handleBotError(error)
        return;
      }

      this.log('fetch inventory success')
      let level
      let uniquePokedex
      const eggs = []
      const pokemons = []
      const items = []
      const candies = []
      const inventoryItems = res.inventory_delta.inventory_items
      inventoryItems.forEach(item => {
        const inventoryItemData = item.inventory_item_data;

        // Candies
        if (inventoryItemData.pokemon_family) {
          const pokemonFamily = inventoryItemData.pokemon_family;
          const pokemonFamilyId = pokemonFamily.family_id;
          const pokemonFamilyCandy = pokemonFamily.candy;

          candies.push({
            pokedexNumber: pokemonFamilyId,
            count: pokemonFamilyCandy,
          })
        }

        // Check for pokemon.
        if (inventoryItemData.pokemon) {
          const pokemon = inventoryItemData.pokemon;
          pokemon.idNumber = String(convertLongToNumber(pokemon.id))
          if (pokemon.is_egg) {
            eggs.push(pokemon);
          } else {
            pokemons.push(pokemon);
          }
        }

        // Check for player stats.
        if (inventoryItemData.player_stats) {
          const player = inventoryItemData.player_stats;
          level = player.level;
          uniquePokedex = player.unique_pokedex_entries
        }

        // Check for item.
        if (inventoryItemData.item) {
          const item = inventoryItemData.item;
          items.push({
            itemId: item.item_id,
            count: item.count,
          });
        }
      })

      Bots.update(this.botId, {
        $set: {
          'pokemonGoProfile.level': level,
          'pokemonGoProfile.uniquePokedex': uniquePokedex,
          'pokemonGoProfile.items': items,
          'pokemonGoProfile.candies': candies,
        },
      })

      this.onFetchInventory && this.onFetchInventory({
        eggs,
        pokemons,
        items,
        candies,
      })
    }));
  }

  evolvePokemon(pokemonId) {
    // if (candiesByPokemon[pokemonId] >= pokedexInfo.candy && pokedexInfo.candy) {
    //   candiesByPokemon[pokemonId] = candiesByPokemon[pokemonId] - pokedexInfo.candy
    //   console.log('SHOULD EVOLVE ' + pokedexInfo.name + ' (' + pokemon.id + ')')

    this.log(`evolving pokemon ${pokemonId}`)
    this.api.EvolvePokemon(pokemonId, Meteor.bindEnvironment((error, res) => {
      if (error) {
        this.handleBotError(error)
        return;
      }

      this.log('evolve pokemon success')
      console.log(res)
    }))
  //   }
  // }
  }
}

/*
if (candiesByPokemon[pokemon.pokemon_id] >= pokedexInfo.candy && pokedexInfo.candy) {
  candiesByPokemon[pokemon.pokemon_id] = candiesByPokemon[pokemon.pokemon_id] - pokedexInfo.candy
  console.log('SHOULD EVOLVE ' + pokedexInfo.name + ' (' + pokemon.id + ')')
  botInstance.EvolvePokemon(pokemon.id.toString(), (err, res) => {
    if (err) {
      console.error(err)
    } else {
      console.log(res)
    }
  })
}
*/
