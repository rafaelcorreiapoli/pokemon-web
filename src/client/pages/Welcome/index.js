import React, { PropTypes } from 'react'
import Counter from '@containers/Counter'
import EggsList from '@containers/EggsList'
import EggMethodListener from '@containers/EggMethodListener'
import PokeMapContainer from '@containers/PokeMapContainer'
import GameScreenContainer from '@containers/GameScreenContainer'
import Bot from '@components/Bot'
class Welcome extends React.Component {
  render() {
    return (
      <div style={{display: 'flex'}}>
        <PokeMapContainer />
        <div style={{width: 600}}>
          <GameScreenContainer />
        </div>
      </div>

    )
  }
}

export default Welcome;
