const INCREASE_EGG_WALK_COUNT = 'eggs/INCREASE_EGG_WALK_COUNT'
const SELECT_EGG = 'eggs/SELECT_EGG'
import { Map } from 'immutable'
import { call } from 'client/ducks/methods'

export const increaseEggWalkCount = (eggId, quantity) => (dispatch) => {
  dispatch(call('eggs.increaseEggWalkCount', {
    eggId,
    quantity,
  }))
  .then(res => {
    console.log('success!', res)
  })
  .catch(err => {
    console.log('err!', err)
  })
}

export const selectEgg = eggId => ({
  type: INCREASE_EGG_WALK_COUNT,
  payload: {
    eggId,
  },
})

const initialState = Map({
  selectedEgg: null,
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_EGG:
      return state.set('selectedEgg', action.payload.eggId)
    default:
      return state
  }
}
