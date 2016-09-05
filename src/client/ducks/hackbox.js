import { Map } from 'immutable'
import moment from 'moment'
const SELECT_TAB = 'hackbox/SELECT_TAB'

export const selectTab = (tab) => ({
  type: SELECT_TAB,
  payload: {
    tab,
  },
})

const initialState = Map({
  selectedTab: 'sniper',
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_TAB:
      return state.set('selectedTab', action.payload.tab)
    default:
      return state
  }
}
