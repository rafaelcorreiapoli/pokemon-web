import React, { PropTypes } from 'react'
import pokemonsById from '@resources/pokemons'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import { Transfer, Evolve } from '@resources/icons'

const styles = {
  avatar: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    height: 'auto',
    maxWidth: 50,
    maxHeight: 50,
  },
}
class SniperListItem extends React.Component {
  static propTypes = {
    pokedexNumber: PropTypes.number,
    iv: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    onSniperPokemon: PropTypes.func,
  }

  render() {
    const {
      pokedexNumber,
      iv,
      latitude,
      longitude,
      onSniperPokemon
    } = this.props

    const goButton = (
      <IconButton
        onClick={onSniperPokemon}
        tooltip="transfers"
      >
        <Transfer />
      </IconButton>
    )
    return (
      <ListItem
        primaryText={pokemonsById[pokedexNumber].name}
        leftAvatar={
          <Avatar
            src={pokemonsById[pokedexNumber].encounterImg}
            style={styles.avatar}
          />
        }
        secondaryText={<span>IV: {<b>{iv || 0}</b>} ({latitude}, {longitude})</span>}
        rightIconButton={goButton}
      />
    )
  }
}


export default SniperListItem
