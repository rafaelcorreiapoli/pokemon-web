import React from 'react';
import PokeMap from '@components/PokeMap'
import { getEncounters } from '@selectors/encounters'
import { getBots, getSelectedBotDocument } from '@selectors/bots'
import { getPokestops } from '@selectors/pokestops'
import { getSelectedBot } from '@selectors/game'
import Encounters from '@collections/encounters'
import Pokestops from '@collections/pokestops'
import Bots from '@collections/bots'
import { selectEncounter,
  selectBot,
  setBotPosition,
  getPokestop,
  catchPokemon,
  encounterPokemon,
} from '@ducks/game'
import { connect } from 'react-redux'
import { composeWithTracker } from 'react-komposer';

const composer = ({ selectedBot }, onData) => {
  const onError = (err) => {
    onData(new Error(err))
  }
  const handlerEncounters = Meteor.subscribe('encounters', { onError })
  const handlerPokestops = Meteor.subscribe('pokestops', { onError })
  const handlerBots = Meteor.subscribe('bots', { onError })

  if (handlerEncounters.ready() && handlerPokestops.ready() && handlerBots.ready()) {
    let currentEncounter = null
    let catchedEncounters = []
    let fleedEncounters = []
    const encounters = getEncounters(Encounters)
    const pokestops = getPokestops(Pokestops)
    const bots = getBots(Bots)
    if (selectedBot) {
      const selectedBotDocument = getSelectedBotDocument(Bots, selectedBot) || {}
      currentEncounter = selectedBotDocument.currentEncounter
      catchedEncounters = selectedBotDocument.catchedEncounters
      fleedEncounters = selectedBotDocument.fleedEncounters
    }
    onData(null, {
      encounters,
      pokestops,
      bots,
      currentEncounter,
      catchedEncounters,
      fleedEncounters,
    })
  }
}

const mapStateToProps = (state) => {
  const selectedBot = getSelectedBot(state)
  return {
    selectedBot,
  }
}

const mapDispatchToProps = dispatch => ({
  handleSelectEncounter(encounterId) {
    dispatch(selectEncounter(encounterId))
  },
  onMapClick(botId, latitude, longitude) {
    dispatch(setBotPosition(botId, latitude, longitude))
  },
  onBotClick(botId) {
    dispatch(selectBot(botId))
  },
  onPokestopClick(botId, pokestopId) {
    dispatch(getPokestop(botId, pokestopId))
  },
  onCatchPokemon(botId, encounterId) {
    dispatch(catchPokemon(botId, encounterId))
  },
  onEncounterPokemon(botId, encounterId) {
    dispatch(encounterPokemon(botId, encounterId))
  },
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(composeWithTracker(composer)(PokeMap))
