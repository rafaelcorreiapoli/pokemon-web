import React from 'react';
import { connect } from 'react-redux'
import GameScreen from '@components/GameScreen'
import { getSelectedTab } from '@selectors/game'
import { getSelectedBot } from '@selectors/bots'
import { selectTab } from '@ducks/game'
import { composeWithTracker } from 'react-komposer'
import Bots from '@collections/bots'
import Pokemons from '@collections/pokemons'
import { call } from '@ducks/methods'

const composer = (props, onData) => {
  if (Meteor.subscribe('bots.selectedBot').ready()) {
    const selectedBot = getSelectedBot(Bots) || null
    const hasToken = selectedBot ? !!selectedBot.token : false

    let pokemonsCount
    let pokemonsMaxCount
    if (selectedBot && selectedBot.pokemonGoProfile) {
      pokemonsCount = Pokemons.find({
        botId: selectedBot._id
      }).count()
      pokemonsMaxCount = selectedBot.pokemonGoProfile.pokeStorage
    }

    onData(null, {
      pokemonsCount,
      pokemonsMaxCount,
      selectedBot,
      hasToken
    })
  }
}

const mapStateToProps = (state, { isSubsReady }) => {
  return {
    selectedTab: getSelectedTab(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleChange(value) {
      dispatch(selectTab(value))
    },
    onLoginBot(botId) {
      console.log(botId)
      dispatch(call('bots.login', { botId }))
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}


const GameScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(composeWithTracker(composer)(GameScreen))

export default GameScreenContainer
