const INCREASE_COUNT = 'counter/increase_count'
const DECREASE_COUNT = 'counter/decrease_count'
import { Map } from 'immutable'
export const getCount = state => state.counter.get('count')

export const increaseCount = () => ({
  type: INCREASE_COUNT,
})

export const decreaseCount = () => ({
  type: DECREASE_COUNT,
})

const initialState = Map({
  count: 0
})
export default (state = initialState, action) => {
  switch (action.type) {
    case INCREASE_COUNT:
      return state.set('count', state.get('count') + 1)
    case DECREASE_COUNT:
      return state.set('count', state.get('count') - 1)
    default:
      return state
  }
}
