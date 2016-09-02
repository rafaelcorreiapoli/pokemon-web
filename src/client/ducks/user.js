import { Map } from 'immutable'
const SET_USER = 'user/SET_USER'

export const setUser = (user) => ({
  type: SET_USER,
  payload: {
    user,
  },
})

const initialState = {}
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload.user
    default:
      return state
  }
}
