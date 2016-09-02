import React, { PropTypes } from 'react'
import DrawerContainer from '@containers/DrawerContainer'
import AppBarContainer from '@containers/AppBarContainer';

class AuthenticatedLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    console.log(this.props)
    const {
      children,
    } = this.props
    return (
      <div>
        <DrawerContainer />
        <AppBarContainer />
        <div>
          {children}
        </div>
      </div>
    )
  }
}

export default AuthenticatedLayout
