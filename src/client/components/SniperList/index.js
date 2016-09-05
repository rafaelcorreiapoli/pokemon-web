import React, { PropTypes } from 'react'
import { List } from 'material-ui/List';
import SniperListItem from './SniperListItem'
import Infinite from 'react-infinite'
class SniperList extends React.Component {
  render() {
    const {
      pokemons,
      onSniperPokemon,
      botId,
    } = this.props

    return (
      <List>
        <Infinite
          elementHeight={72}
          containerHeight={752}
        >
        {
          pokemons && pokemons.map(pokemon => {
            return (
              <SniperListItem
                key={pokemon._id}
                onSniperPokemon={() => onSniperPokemon(botId, pokemon.latitude, pokemon.longitude)}
                {...pokemon}
              />
            )
          })
        }
        </Infinite>
      </List>
    )
  }
}

export default SniperList
