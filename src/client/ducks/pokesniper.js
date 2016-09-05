import { Map, List, fromJS } from 'immutable'
import moment from 'moment'
const SET_POKEMONS = 'pokesniper/SET_POKEMONS'
import 'whatwg-fetch'

export const setPokemons = pokemons => ({
  type: SET_POKEMONS,
  payload: {
    pokemons,
  },
})

export const fetchPokemons = dispatch => {

}

const initialState = Map({
  selectedTab: 'pokesniper',
  pokemons: List(),
})

export default (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case SET_POKEMONS:
      return state.set('pokemons', fromJS(action.payload.pokemons))
    default:
      return state
  }
}
