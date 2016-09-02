import React, { PropTypes } from 'react'
import styles from './styles'

const Counter = ({
  count,
  increaseCount,
  decreaseCount,
}) => (
  <div>
    <h1>{count}</h1>
    <div style={styles.buttonRow}>
      <button onClick={decreaseCount}>-</button>
      <button onClick={increaseCount}>+</button>
    </div>
  </div>
)

Counter.propTypes = {
  count: PropTypes.number.isRequired,
  increaseCount: PropTypes.func.isRequired,
  decreaseCount: PropTypes.func.isRequired,
}

Counter.defaultProps = {
  count: 0,
}
export default Counter
