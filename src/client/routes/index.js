import React, { PropTypes } from 'react'
import { Router, IndexRoute, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import store from '../store'
import App from '../components/App';
import Welcome from '../pages/Welcome'

const Routes = () => (
  <Router history={syncHistoryWithStore(browserHistory, store)}>
    <Route path="/" component={App}>
      <IndexRoute component={Welcome} />
    </Route>
  </Router>
)

export default Routes
