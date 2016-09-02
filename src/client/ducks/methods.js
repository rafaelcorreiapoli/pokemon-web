const START_METHOD_REQUEST = 'methods/START_METHOD_REQUEST'
const METHOD_SUCCESS = 'methods/METHOD_SUCCESS'
const METHOD_ERROR = 'methods/METHOD_ERROR'
import { Map } from 'immutable'
export const call = (method, params) => (dispatch, getState, Meteor) => (
  new Promise((resolve, reject) => {
    dispatch({
      type: START_METHOD_REQUEST,
      payload: {
        method,
      },
    })
    Meteor.call(method, params, (err, res) => {
      if (!err) {
        dispatch({
          type: METHOD_SUCCESS,
          payload: {
            method,
          },
        })
        return resolve(res)
      }
      dispatch({
        type: METHOD_ERROR,
        payload: {
          method,
        },
      })
      return reject(err)
    })
  })
)

export const getMethodState = (state, method) => {
  const map = state.methods.get(method)

  return {
    loading: map && map.get('loading') || false,
    success: map && map.get('success') || false,
    error: map && map.get('error') || false,
  }
}


// const methodShape = Map({
//   loading: false,
//   error: false,
//   success: false,
// })
//
// const initialValues = Map({
//   'Users.methods.atualizarCadastroPessoal': methodShape,
// })

export default (state = Map({}), action) => {
  switch (action.type) {
    case START_METHOD_REQUEST:
      return state.setIn([action.payload.method, 'loading'], true)
      .setIn([action.payload.method, 'success'], false)
      .setIn([action.payload.method, 'error'], false)
    case METHOD_SUCCESS:
      return state.setIn([action.payload.method, 'loading'], false)
        .setIn([action.payload.method, 'success'], true)
        .setIn([action.payload.method, 'error'], false)
    case METHOD_ERROR:
      return state.setIn([action.payload.method, 'loading'], false)
        .setIn([action.payload.method, 'success'], false)
        .setIn([action.payload.method, 'error'], true)
    default:
      return state
  }
}
