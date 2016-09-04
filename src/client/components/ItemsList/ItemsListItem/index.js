import React, { PropTypes } from 'react'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar';
import itemsById from '@resources/items'

const ItemsListItem = ({
  itemId,
  count
}) => {
  return (
    <ListItem
      primaryText={itemsById[itemId].name}
      leftAvatar={<Avatar src={itemsById[itemId].img} style={{borderRadius: 0, backgroundColor: 'transparent'}}/>}
      secondaryText={`x${count}`}
    />
  )
}

export default ItemsListItem
