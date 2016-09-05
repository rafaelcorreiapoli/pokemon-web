import React, { PropTypes } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

class HackTools extends React.Component {
  render() {
    const {
      onRemoveSoftBan,
      onWalkToClosestPokestop,
      selectedBot
    } = this.props

    return (
      <div>
        <RaisedButton
          label={"REMOVE SOFTBAN"}
          onClick={() => onRemoveSoftBan(selectedBot._id)}
          primary={true}
        />
        <RaisedButton
          label={"WALK TO CLOSEST POKESTOP"}
          onClick={() => onWalkToClosestPokestop(selectedBot._id)}
          primary={true}
        />
      </div>
    )
  }
}

export default HackTools;
