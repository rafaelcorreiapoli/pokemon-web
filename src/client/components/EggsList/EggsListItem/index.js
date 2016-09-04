import React, { PropTypes } from 'react'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar';
import LinearProgress from 'material-ui/LinearProgress';

const EggsListItem = ({
  pokemonId,
  walkedTarget,
  walkedStart,
}) => {
  return (
    <ListItem
      primaryText={`${walkedTarget} km`}
      leftAvatar={<Avatar src='https://lh3.ggpht.com/8eBuGPiZyQB4zAn8p2uDU81rKaHYCYUmnPrFDqm0wFZIfOQVCnIOLIQeHz6SiwAydC8=w100'
        style={{borderRadius: 0, backgroundColor: 'transparent'}}/>}
      secondaryText={
        <div style={{display: 'flex', alignItems: 'center'}}>
          <LinearProgress color="#00BFFF" mode="determinate" value={walkedStart / walkedTarget * 100} />
        <span style={{marginLeft: 10}}>{`${walkedStart || 0}/${walkedTarget}`}</span>
        </div>
      }
    />
  )
}

export default EggsListItem
