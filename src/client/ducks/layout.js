export const SET_DRAWER_OPEN = 'app/SET_DRAWER_OPEN';
export const SET_INSERT_BOT_DIALOG_OPEN = 'layout/SET_INSERT_BOT_DIALOG_OPEN'

import { Map } from 'immutable';

export function setDrawerOpen(open) {
  return {
    type: SET_DRAWER_OPEN,
    payload: {
      open,
    },
  }
}

export const setInsertBotDialogOpen = (open) => ({
  type: SET_INSERT_BOT_DIALOG_OPEN,
  payload: {
    open,
  },
})
const initialState = Map({
  drawerOpen: false,
  insertBotDialogOpen: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DRAWER_OPEN:
      return state.set('drawerOpen', action.payload.open)
    case SET_INSERT_BOT_DIALOG_OPEN:
      return state.set('insertBotDialogOpen', action.payload.open)
    default:
      return state;
  }
}
