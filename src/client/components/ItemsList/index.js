import React, { PropTypes } from 'react'
import { List } from 'material-ui/List';
import ItemsListItem from './ItemsListItem'
import Infinite from 'react-infinite'

const ItemsList = ({
  items
}) => {
  return (
    <List>
      <Infinite elementHeight={72}
       containerHeight={752}
      >
      {
        items && items.map((item, key) => (
          <ItemsListItem
            key={key}
            {...item}
          />
        ))
      }
      </Infinite>
    </List>
  )
}

export default ItemsList
