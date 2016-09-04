import React from 'react';
import { connect } from 'react-redux'
import { composeWithTracker } from 'react-komposer'
import PokemonsList from '@components/PokemonsList'
import Pokemons from '@collections/pokemons'
import { call } from '@ducks/methods'
import Bots from '@collections/bots'
import { getSelectedBot } from '@selectors/bots'

const composer = ({ selectedBotId }, onData) => {
  if (Meteor.subscribe('pokemons.byBot', { botId: selectedBotId }).ready()) {
    const pokemons = Pokemons.find({
      botId: selectedBotId,
    }).fetch()
    onData(null, {
      pokemons,
    })
  }
}

const mapDispatchToProps = (dispatch, { selectedBotId }) => ({
  onClickTransfer(pokemonIdNumber) {
    dispatch(call('bots.transferPokemon', { botId: selectedBotId, pokemonIdNumber }))
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  }
})
export default connect(
  null,
  mapDispatchToProps
)(composeWithTracker(composer)(PokemonsList))
