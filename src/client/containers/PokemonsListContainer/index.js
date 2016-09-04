import React from 'react';
import { connect } from 'react-redux'
import { composeWithTracker } from 'react-komposer'
import PokemonsList from '@components/PokemonsList'
import Pokemons from '@collections/pokemons'

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

export default composeWithTracker(composer)(PokemonsList)
