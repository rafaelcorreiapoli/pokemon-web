import { Map } from 'immutable'
export const SET_USER = 'user/SET_USER'

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
      return Object.assign({}, action.payload.user)
    default:
      return state
  }
}
