import React, { PropTypes } from 'react';
import {
  AppBar as MUIAppBar,
  IconButton,
  MenuItem,
  Divider,
} from 'material-ui'
import IconMenu from 'material-ui/IconMenu'
import { Menu, Add, Logout, Help, Profile } from '@resources/icons'

class AppBar extends React.Component {
  static propTypes = {
    onClickToggleMenu: PropTypes.func,
    onClickNewPatrolman: PropTypes.func,
    onClickProfileLink: PropTypes.func,
    onClickHelpLink: PropTypes.func,
    onClickLogoutLink: PropTypes.func,
  }
  render() {
    const {
      onClickToggleMenu,
      onClickNewPatrolman,
      onClickProfileLink,
      onClickHelpLink,
      onClickLogoutLink,
    } = this.props
    return (
      <MUIAppBar
        titleStyle={{
          textAlign: 'center',
        }}
        title="POKE-PATROL"
        style={{ color: 'black' }}
        onLeftIconButtonTouchTap={onClickToggleMenu}
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <IconButton><Menu /></IconButton>
            }
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <MenuItem
              leftIcon={<Profile />}
              primaryText="Profile"
              onClick={onClickProfileLink}
            />
            <Divider />
            <MenuItem
              leftIcon={<Add />}
              primaryText="New Patrolman"
              onClick={onClickNewPatrolman}
            />
            <MenuItem
              leftIcon={<Help />}
              primaryText="Help"
              onClick={onClickHelpLink}
            />
            <MenuItem
              leftIcon={<Logout />}
              primaryText="Logout"
              onClick={onClickLogoutLink}
            />
          </IconMenu>
        }
      />
    )
  }
}



export default AppBar;
