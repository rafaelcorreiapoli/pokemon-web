import React from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { setDrawerOpen, setInsertBotDialogOpen } from '@ducks/layout'
import { logout } from '@ducks/login'
import AppBar from '@components/AppBar'
import Bots from '@collections/bots'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import { call } from '@ducks/methods'

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClickToggleMenu() {
      dispatch(setDrawerOpen(true))
    },
    onClickProfileLink() {
      dispatch(push('/profile'))
    },
    onClickAdd() {
      console.log('add')
      dispatch(setInsertBotDialogOpen(true))
    },
    onClickHelpLink() {
      dispatch(push('/help'))
    },
    onClickLogoutLink() {
      dispatch(logout())
    },
    onClickBot(botId) {
      dispatch(call('bots.selectBot', { botId }))
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}

const composer = (props, onData) => {
  if (Meteor.subscribe('bots').ready()) {
    const bots = Bots.find({ userId: Meteor.userId()}).fetch()

    onData(null, {
      bots,
    })
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(composeWithTracker(composer)(AppBar))
