import React, { PropTypes } from 'react'
import Counter from '@containers/Counter'
import EggsList from '@containers/EggsList'
import EggMethodListener from '@containers/EggMethodListener'
import PokeMap from '@containers/PokeMapContainer'

class Welcome extends React.Component {
  render() {
    return (
      <div>
        <PokeMap />
      </div>
    )
  }
}

export default Welcome;
