import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { getMethodState } from 'client/ducks/methods'

const mapStateToProps = (state) => ({
  isLoading: getMethodState(state, 'eggs.increaseEggWalkCount').loading,
  isError: getMethodState(state, 'eggs.increaseEggWalkCount').error,
  isSuccess: getMethodState(state, 'eggs.increaseEggWalkCount').success,
})

class EggMethodListener extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    isSuccess: PropTypes.bool.isRequired,
  }

  render() {
    const {
      isLoading,
      isError,
      isSuccess,
    } = this.props

    return (
      <div>
        {isLoading && <span>loading...</span>}
        {isError && <span>error :(</span>}
        {isSuccess && <span>success!</span>}
      </div>
    )
  }
}
export default connect(
  mapStateToProps,
)(EggMethodListener)
