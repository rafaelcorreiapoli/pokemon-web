import React, { PropTypes } from 'react'
import pokemonsById from '@resources/pokemons'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import { Transfer, Evolve } from '@resources/icons'

class PokemonListItem extends React.Component {
  static propTypes = {
    pokemonId: PropTypes.object, // high, low object
    pokedexId: PropTypes.number,
    cp: PropTypes.number,
    stamina: PropTypes.number,
    staminaMax: PropTypes.number,
    height: PropTypes.number,
    weight: PropTypes.number,
    attack: PropTypes.number,
    defense: PropTypes.number,
    moves: PropTypes.array,
    candyCount: PropTypes.number,
    onClickEvolve: PropTypes.func,
    onClickTransfer: PropTypes.func,
  }

  render() {
    const {
      pokemonId,
      pokedexId,
      cp,
      stamina,
      staminaMax,
      height,
      weight,
      attack,
      defense,
      moves,
      candyCount,
      onClickEvolve,
      onClickTransfer,
    } = this.props

    const evolveButton = (
      <IconButton
        onClick={() => onClickEvolve(pokemonId)}
        tooltip="esvolsve"
      >
        <Evolve />
      </IconButton>
    )
    const transferButton = (
      <IconButton
        onClick={() => onClickTransfer(pokemonId)}
        tooltip="transfers"
      >
        <Transfer />
      </IconButton>
    )
    return (
      <ListItem
        primaryText={pokemonsById[pokedexId].name}
        leftAvatar={
          <Avatar
            src={pokemonsById[pokedexId].encounterImg}
            style={{ borderRadius: 0, backgroundColor: 'transparent', height: 'auto', maxWidth: 50, maxHeight: 50}}
          />
        }
        secondaryText={`CPsss: ${cp}`}
        rightIconButton={transferButton}
      />
    )
  }
}


export default PokemonListItem
