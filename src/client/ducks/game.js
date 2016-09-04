import { Map, OrderedMap } from 'immutable'
const SELECT_TAB = 'game/SELECT_TAB'
const SELECT_ENCOUNTER = 'map/SELECT_ENCOUNTER'
const SELECT_BOT = 'map/SELECT_BOT'
const CATCH_POKEMON = 'map/CATCH_POKEMON'
const ENCOUNTER_POKEMON = 'map/ENCOUNTER_POKEMON'
const DISPLAY_ITEMS_AWARDED = 'map/DISPLAY_ITEMS_AWARDED'
const HIDE_ITEMS_AWARDED = 'map/HIDE_ITEMS_AWARDED'
import { Random } from 'meteor/random'

import { call } from '@ducks/methods'

const initialState = Map({
  selectedTab: 'pokemons',
  selectedEncounterId: null,
  selectedBot: 'F9qJuG7X6kZRzimkg',
  itemsAwardedDisplay: OrderedMap()
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_ENCOUNTER:
      return state.set('selectedEncounterId', action.payload.encounterId)
    case SELECT_BOT:
      return state.set('selectedBot', action.payload.botId)
    case SELECT_TAB:
      return state.set('selectedTab', action.payload.tab)
    case DISPLAY_ITEMS_AWARDED:
      return state.setIn(['itemsAwardedDisplay', action.payload.id], action.payload.itemsAwarded)
    case HIDE_ITEMS_AWARDED:
      return state.deleteIn(['itemsAwardedDisplay', action.payload.id])
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

export const displayItemsAwarded = (itemsAwarded, id) => ({
  type: DISPLAY_ITEMS_AWARDED,
  payload: {
    itemsAwarded,
    id
  }
})
export const hideItemsAwarded = (id) => ({
  type: HIDE_ITEMS_AWARDED,
  payload: {
    id
  }
})

export const getPokestop = (botId, pokestopId) => (dispatch, getState) => {
  dispatch(
    call('bots.getPokestop', { botId, pokestopId })
  )
  .then(res => {
    const state = getState()
    const nextItemsSlotId = Random.id()

    dispatch(displayItemsAwarded(res.itemsAwarded, nextItemsSlotId))
    setTimeout(() => {
      dispatch(hideItemsAwarded(nextItemsSlotId))
    }, 5000)
  })
  .catch(err => {
    console.log(err)
  })
}

export const catchPokemon = (botId, encounterIdNumber) => dispatch => {
  dispatch(
    call('bots.catchPokemon', { botId, encounterIdNumber })
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
    call('bots.encounterPokemon', { botId, encounterIdNumber })
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
