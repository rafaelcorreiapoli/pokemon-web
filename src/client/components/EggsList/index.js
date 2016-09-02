import React, { PropTypes } from 'react'
import Egg from '../Egg'

class EggsList extends React.Component {
  static propTypes = {
    eggs: PropTypes.array.isRequired,
    increaseEggWalkCount: PropTypes.func.isRequired,
  }

  render() {
    const {
      eggs,
      increaseEggWalkCount,
    } = this.props
    return (
      <div>
        {
          eggs && eggs.map(egg =>
            <Egg
              key={egg._id}
              onEggClick={() => increaseEggWalkCount(egg._id)}
              {...egg}
            />
        )
        }
      </div>
    )
  }
}

export default EggsList;
