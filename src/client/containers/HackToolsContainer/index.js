import { connect } from 'react-redux'
import HackTools from '@components/HackTools'
import { call } from '@ducks/methods'
import { getSelectedBot } from '@selectors/bots'
import Bots from '@collections/bots'

const mapStateToProps = state => {
  const selectedBot = getSelectedBot(Bots)
  return {
    selectedBot
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onRemoveSoftBan(botId) {
      console.log(botId)
      dispatch(call('bots.removeSoftBan', { botId }))
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    },
    onWalkToClosestPokestop(botId) {
      dispatch(call('bots.walkToClosestPokestop', { botId }))
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HackTools)
