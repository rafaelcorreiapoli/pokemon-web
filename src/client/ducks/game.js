import { Map } from 'immutable'
const SELECT_TAB = 'game/SELECT_TAB'
const SELECT_ENCOUNTER = 'map/SELECT_ENCOUNTER'
const SELECT_BOT = 'map/SELECT_BOT'
const CATCH_POKEMON = 'map/CATCH_POKEMON'
const ENCOUNTER_POKEMON = 'map/ENCOUNTER_POKEMON'
import { call } from '@ducks/methods'

const initialState = Map({
  selectedTab: 'pokemons',
  selectedEncounterId: null,
  selectedBot: 'F9qJuG7X6kZRzimkg',
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_ENCOUNTER:
      return state.set('selectedEncounterId', action.payload.encounterId)
    case SELECT_BOT:
      return state.set('selectedBot', action.payload.botId)
    case SELECT_TAB:
      return state.set('selectedTab', action.payload.tab)
    default:
      return state
  }
}

export const selectBot = (botId) => ({
  type: SELECT_BOT,
  payload: {
    botId,
  },
})

export const setBotPosition = (botId, latitude, longitude) => (dispatch) => {
  dispatch(
    call('bots.setPosition', { botId, latitude, longitude })
  )
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
}

export const getPokestop = (botId, pokestopId) => dispatch => {
  dispatch(
    call('pokestops.get', { botId, pokestopId })
  )
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
}

export const catchPokemon = (botId, encounterIdNumber) => dispatch => {
  dispatch(
    call('encounters.catch', { botId, encounterIdNumber })
  )
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.error(err)
  })
}

export const encounterPokemon = (botId, encounterIdNumber) => dispatch => {
  dispatch(
    call('encounters.encounter', { botId, encounterIdNumber })
  )
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.error(err)
  })
}


export const selectEncounter = (encounterId) => ({
  type: SELECT_ENCOUNTER,
  payload: {
    encounterId,
  },
})

export const selectTab = (tab) => ({
  type: SELECT_TAB,
  payload: {
    tab,
  },
})
