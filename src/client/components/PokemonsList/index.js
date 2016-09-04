import React, { PropTypes } from 'react'
import { List } from 'material-ui/List';
import PokemonsListItem from './PokemonsListItem'
import Infinite from 'react-infinite'


class PokemonsList extends React.Component {

  render() {
    const {
      pokemons
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
              <PokemonsListItem
                key={pokemon._id}
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

export default PokemonsList
