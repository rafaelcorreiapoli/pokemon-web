import { calculateRoutePlan } from '@algorithms/routes'
import geolib from 'geolib'
import pokemonsById from '@resources/pokemons'

const CLOSEST_POKESTOP = 'closest_pokestop'
const POKESTOPS = 'pokestops'
const POKEMONS = 'pokemons'
const ROUTE = 'route'
const STATE = 'state'
const WALKING = 'walking'
const IDLE = 'IDLE'
const ENCOUNTERING = 'encountering'
const SNIPERING = 'snipering'
const CATCHABLE_POKEMONS = 'CATCHABLE_POKEMONS'

const SAFE_ENCOUNTER_DISTANCE = 100
const SAFE_POKESTOP_DISTANCE = 40

const ALWAYS_TRANSFER = 'ALWAYS_TRANSFER'
const NEVER_TRANSFER = 'NEVER_TRANSFER'

class AI {
  constructor(lat, lng) {
    this.memory = {}
    this.input = {}
    this.lat = lat
    this.lng = lng
    this.config = {
      getPokestops: true,
      catchPokemons: true,
      transferPokemons: ALWAYS_TRANSFER,
    }

    this.reset()
    this.decideNextAction()
  }

  reset() {
    this.state = IDLE
  }

  setMemory(key, value) {
    this.memory[key] = value
  }
  setInput(key, value) {
    this.input[key] = value
  }

  getInput(key) {
    return this.input[key]
  }

  getMyPosition() {
    return {
      latitude: this.lat,
      longitude: this.lng,
    }
  }

  setEncounters(encounters) {
    encounters.sort((a, b) => {
      const distanceToA = geolib.getDistance(this.getMyPosition(), {
        latitude: a.latitude,
        longitude: b.longitude,
      })
      const distanceToB = geolib.getDistance(this.getMyPosition(), {
        latitude: b.latitude,
        longitude: b.longitude,
      })

      return distanceToA - distanceToB
    })

    console.log(encounters)
  }


  setClosestPokestop(pokestop) {
    this.closestPokestop = pokestop
  }

  getNextPokestop() {
    const closestPokestop = this.closestPokestop
    if (
      this.config.getPokestops &&
      closestPokestop &&
      this.isSafeDistanceToPokestop(closestPokestop)
    ) {
      return closestPokestop
    }
    return null
  }

  getNextEncounter() {
    const closestEncounter = this.getClosestEncounter()
    if (
      this.config.catchPokemons
      && this.sufficientBallsToCatch()
      && this.enoughSpaceForNewPokemon()
      && closestEncounter
      && this.isSafeDistanceToEncounter(closestEncounter)
    ) {
      return closestEncounter
    }
    return null
  }

  getPokemonsOfPokedexNumber(pokedexNumber) {
    return this.pokemons.filter(pokemon => pokemon.pokedexNumber === pokedexNumber).length
  }

  getWeakestPokemon(pokemons) {
    return pokemons.filter((a, b) => a.cp - b.cp)
  }

  /**
   * getNextTransfer
   * check if there are a pokemon waiting to be transfered by checking config, candies,
   * pokemons and selecting the weakest one
   * @returns Pokemon
   */
  getNextTransfer() {
    const candies = this.candies

    if (this.config.transferPokemons === NEVER_TRANSFER) {
      return null
    }

    // Is there a candy that has a sufficient count AND I have 2 or more pokemons of that type ?
    const interestingCandy = candies.find(candy =>
      candy.count > pokemonsById[candy.pokedexNumber].candy &&
      this.getPokemonsOfPokedexNumber(candy.pokedexNumber).length > 1
    )


    if (interestingCandy) {
      // If there is, let's find which pokemon is the weakest in terms of CP
      const weakestPokemon = this.getWeakestPokemon(
        this.getPokemonsOfPokedexNumber(interestingCandy.pokedexNumber))
      return weakestPokemon
    }
    return null
  }

  /**
   * sufficientBallsToCatch
   * check if we have any balls to catch a pokemon
   * @returns Boolean
   */
  sufficientBallsToCatch() {
    return this.pokeballs > 0 || this.greatballs > 0 || this.ultraballs > 0
  }

  /**
   * enoughSpaceForNewPokemon
   * check if we have enough space on the storage for a new pokemon
   */
  enoughSpaceForNewPokemon() {
    return this.pokeStorage > this.pokemons
  }

  /**
   * getClosestEncounter
   * return the closest encounter, for now we are assuming that they are ordered
   * @returns Encounter
   */
  getClosestEncounter() {
    return this.encounters[0]
  }

  /**
   * distanceFromMe
   * - returns distance in METERS
   * @param latitude Number
   * @param longitude Number
   * @returns Number
   */

  distanceFromMe(latitude, longitude) {
    return geolib.getDistance(this.getMyPosition(), {
      latitude,
      longitude,
    })
  }

  /**
   * isSafeDistanceToEncounter
   * checks if we have a safe distance from the bot to the Encounter
   * @returns Boolean
   */
  isSafeDistanceToEncounter(encounter) {
    return this.distanceFromMe(encounter.latitude, encounter.longitude) < SAFE_ENCOUNTER_DISTANCE
  }

  /**
   * isSafeDistanceToPokestop
   * checks if we have a safe distance from the bot to the Pokestop
   * @returns Boolean
   */
  isSafeDistanceToPokestop(pokestop) {
    return this.distanceFromMe(pokestop.latitude, pokestop.longitude) < SAFE_POKESTOP_DISTANCE
  }

  emit(what) {
    console.log(what)
  }

  /**
   * buildRouteTo
   * builds an array of points from bot position to destination,
   * given how many meters we will walk each point
   * @param latitude Number
   * @param longitude Number
   * @param metersPerStep Number
   */
  buildRouteTo(latitude, longitude, metersPerStep) {
    return calculateRoutePlan(this.getMyPosition(), {
      latitude,
      longitude,
    }, metersPerStep)
  }

  /**
   * Decide what is the next route we must follow when WALKING
   * @returns Route
   * type: String (pokestop, encounter, random, etc)
   * id: String (identifier of the destination, could be an Id for pokestops or encounters)
   * points: [Points] (array of points)
   */
  getNextRoute() {
    if (this.closestPokestop) {
      return {
        type: 'pokestop',
        id: this.closestPokestop.id,
        points: this.buildRouteTo(this.closestPokestop),
      }
    }
    return null
  }

  setCurrentRoute(currentRoute) {
    this.currentRoute = currentRoute
  }

  getNextMapPoint() {
    if (this.currentRoute && this.currentRoute.points.length > 0) {
      return this.currentRoute.points[0]
    }
  }

  pointReached() {
    if (this.currentRoute) {
      this.currentRoute.points.shift()
    }
  }

  setState(state) {
    this.state = state
  }
  decideNextAction() {
    if (this.state === IDLE) {
      //  if our AI is idle, let's find the new target and get a route to it
      const nextRoute = this.getNextRoute()
      if (nextRoute) {
        // tell our supervisor that we decided a new route
        this.emit('newRoute', nextRoute)
        this.setCurrentRoute(nextRoute)
        this.setState(WALKING)
      }
    } else if (this.state === WALKING) {
      // if we are walking on the map, lets check if there are pokemons near by
      const encounter = this.getNextEncounter()
      if (encounter) {
        // all conditions to encounter pokemon have been satisfied, emit the signal to encounter it
        this.emit('encounter', encounter)
        return;
      }

      //  no conditions to encounter pokemon, lets search for pokestops
      const pokestop = this.getNextPokestop()
      if (pokestop) {
        this.emit('pokestop', pokestop)
        return;
      }

      //  check if we must transfer any pokemon
      const transfer = this.getNextTransfer()
      if (transfer) {
        this.emit('transfer', transfer)
        return;
      }

      // no encounters, pokestops or transfer, let's follow our currentRoute
      const nextPoint = this.getNextMapPoint()
      if (nextPoint) {
        this.emit('setLocation', nextPoint)
      }
    } else if (this.state === ENCOUNTERING) {


    } else if (this.state === SNIPERING) {

    }
  }

  start() {

  }

  stop() {

  }

}
