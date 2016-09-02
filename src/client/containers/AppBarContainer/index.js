import React from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { setDrawerOpen } from '@ducks/layout'
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
    onClickAddLink() {
      dispatch(push('/novo-projeto'))
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
