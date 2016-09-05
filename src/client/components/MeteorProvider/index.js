import React, { PropTypes } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Tracker } from 'meteor/tracker'
import { setUser } from '@ducks/user'
import { connect } from 'react-redux'

const composer = ({ setUser }, onData) => {
  onData(null, {})
  if (!Meteor.loggingIn()) {
    const user = Meteor.user()
    setUser({ user })
  }
}

const mapDispatchToProps = dispatch => ({
  setUser(user) {
    dispatch(setUser(user))
  }
})

export default connect(
  null,
  mapDispatchToProps
)(composeWithTracker(composer)(({ children }) => children))
