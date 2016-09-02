import React, { PropTypes } from 'react'
import { Router, IndexRoute, Route, browserHistory, IndexRedirect } from 'react-router'
import { syncHistoryWithStore, replace } from 'react-router-redux'
import store from '../store'
import AppContainer from '@containers/AppContainer';
import AuthenticatedLayout from '@components/AuthenticatedLayout'
import Welcome from '@pages/Welcome'
import LoginScreen from '@pages/LoginScreen'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { clearLogoutRequest } from '@ducks/login'

const Loading = ({
  children
}) => {
  return (
    <div>
      Im loading!
    </div>
  )
}

const userIsAuthenticated = UserAuthWrapper({
  wrapperDisplayName: 'UserIsAuthenticated',
  authSelector: state => state.user,
  authenticatingSelector: state => state.login.get('loading'),
  LoadingComponent: Loading,
  redirectAction: newLoc => (dispatch, getState) => {
    //  se o usuário clicou no botão de logout, vou mandá-lo para a tela de login sem o redirect
    const state = getState()
    if (state.login.get('logoutRequest')){
      delete newLoc.query.redirect
    }
    dispatch(clearLogoutRequest());
    dispatch(replace(newLoc))
  },
})

const Routes = () => (
  <Router history={syncHistoryWithStore(browserHistory, store)}>
    <Route path="/" component={AppContainer}>
      <Route component={userIsAuthenticated(AuthenticatedLayout)}>
        <IndexRoute component={Welcome} />
      </Route>
      <Route path="login" component={LoginScreen} />
    </Route>
  </Router>
)

export default Routes
