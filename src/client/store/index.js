import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers';
import { Meteor } from 'meteor/meteor'
const routerMiddleware = createRouterMiddleware(browserHistory)
const loggerMiddleware = createLogger({
  predicate: (getState, action) => !/redux-form|immutable-collection/.test(action.type),
});

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(
    thunkMiddleware.withExtraArgument(Meteor),
    loggerMiddleware,
    routerMiddleware
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

export default store;
