import React, { PropTypes } from 'react'

class Egg extends React.Component {
  static propTypes = {
    walkedStart: PropTypes.number.isRequired,
    walkedTarget: PropTypes.number.isRequired,
    onEggClick: PropTypes.func.isRequired,
  }
  static defaultProps = {
    walkedStart: 0,
  }
  render() {
    const {
      walkedStart,
      walkedTarget,
      onEggClick,
    } = this.props

    return (
      <div onClick={onEggClick}>
        <img src="https://boost-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Pokemon-Go-Egg.png" />
        <span>{walkedStart} / {walkedTarget}</span>
      </div>
    )
  }
}

export default Egg;
