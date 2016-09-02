import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux'
import counter from '@ducks/counter'
import eggs from '@ducks/eggs'
import methods from '@ducks/methods'
import game from '@ducks/game'
import login from '@ducks/login'
import layout from '@ducks/layout'

const rootReducer = combineReducers({
  form: formReducer,
  routing: routerReducer,
  methods,
  counter,
  eggs,
  game,
  login,
  layout,
});

export default rootReducer
