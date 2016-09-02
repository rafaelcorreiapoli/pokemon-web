export const SET_DRAWER_OPEN = 'app/SET_DRAWER_OPEN';

import { Map } from 'immutable';

export function setDrawerOpen(open) {
  return {
    type: SET_DRAWER_OPEN,
    payload: {
      open,
    },
  }
}


const initialState = Map({
  drawerOpen: false,
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DRAWER_OPEN:
      return state.set('drawerOpen', action.payload.open)
    default:
      return state;
  }
}
