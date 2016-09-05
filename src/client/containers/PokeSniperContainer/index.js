import React from 'react';
import { connect } from 'react-redux'
import PokeSniper from '@components/PokeSniper'
import Pokesnipers from '@collections/pokesnipers'
import { fetchPokemons } from '@ducks/pokesniper'
import { composeWithTracker } from 'react-komposer'
import { getPokesnipers }  from '@selectors/pokesnipers'
import { call } from '@ducks/methods'
import { getSelectedBot } from '@selectors/bots'
import Bots from '@collections/bots'

const mapDispatchToProps = dispatch => ({
  onSniperPokemon(botId, latitude, longitude) {
    dispatch(call('bots.sniperPokemon', { botId, latitude, longitude }))
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  }
})

const mapStateToProps = state => ({

})

const composer = (props, onData) => {
  if (Meteor.subscribe('pokesnipers').ready()) {
    const pokemons = getPokesnipers(Pokesnipers)
    const botId = getSelectedBot(Bots)._id
    onData(null, {
      pokemons,
      botId,
    })
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(composeWithTracker(composer)(PokeSniper))
