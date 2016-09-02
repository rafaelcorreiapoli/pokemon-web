import React, { PropTypes } from 'react'
import { Drawer as MUDrawer, MenuItem } from 'material-ui';
import {
  Add,
} from '@resources/icons'

class Drawer extends React.Component {
  static propTypes = {
    onClickAdd: PropTypes.func,
    onChangeDrawerState: PropTypes.func,
    drawerOpen: PropTypes.bool.isRequired,
  }

  render() {
    const {
      onClickAdd,
      drawerOpen,
      onChangeDrawerState,
    } = this.props

    return (
      <MUDrawer
        docked={false}
        open={drawerOpen}
        onRequestChange={(open) => onChangeDrawerState(open)}
      >
        <MenuItem
          leftIcon={<Add />}
          onClick={onClickAdd}
        >
          Add
        </MenuItem>
      </MUDrawer>
    )
  }
}

export default Drawer
