import React, { PropTypes } from 'react'
import SniperList from '@components/SniperList'
class PokeSniper extends React.Component {
  render() {
    const {
      pokemons,
      onSniperPokemon,
      botId
    } = this.props
    return (
      <div>
        <SniperList
          pokemons={pokemons}
          onSniperPokemon={onSniperPokemon}
          botId={botId}
        />
      </div>
    )
  }
}

export default PokeSniper;
