import React from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { setDrawerOpen, setInsertBotDialogOpen } from '@ducks/layout'
import { logout } from '@ducks/login'
import AppBar from '@components/AppBar'

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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBar)
