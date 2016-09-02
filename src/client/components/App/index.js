import React, { PropTypes } from 'react'

class App extends React.Component {
  static displayName = 'App'
  static propTypes = {
    children: PropTypes.node,
  }
  render() {
    const {
      children,
    } = this.props

    return (
      <div>
        {children}
      </div>
    )
  }
}

export default App;
