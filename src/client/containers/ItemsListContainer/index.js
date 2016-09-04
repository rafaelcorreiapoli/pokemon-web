import { connect } from 'react-redux'
import { composeWithTracker } from 'react-komposer'
import ItemsList from '@components/ItemsList'
import { call } from '@ducks/methods'
import Bots from '@collections/bots'
import { getSelectedBot } from '@selectors/bots'

const composer = ({ selectedBotId }, onData) => {
  if (Meteor.subscribe('bots.selectedBot').ready()) {
    const selectedBot = getSelectedBot(Bots)
    const items = selectedBot.pokemonGoProfile.items || []
    onData(null, {
      items
    })
  }
}

const mapDispatchToProps = (dispatch, { selectedBotId }) => ({
  onClickDrop(pokemonIdNumber) {
    dispatch(call('bots.dropItem', { botId: selectedBotId, pokemonIdNumber }))
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
)(composeWithTracker(composer)(ItemsList))
