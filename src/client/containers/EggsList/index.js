import React, { PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import EggsList from 'client/components/EggsList'
import Eggs from '@collections/eggs'
import { increaseEggWalkCount } from '@ducks/eggs'
//  import reduxKomposer from 'client/components/ReduxKomposer'
import { connect } from 'react-redux'
import { composeWithTracker } from 'react-komposer';

const composer = (props, onData) => {
  const onError = (err) => {
    onData(new Error(err))
  }
  if (Meteor.subscribe('eggs', { botId: 'F9qJuG7X6kZRzimkg', onError }).ready()) {
    const eggs = Eggs.find({
      walkedStart: {
        $gte: props.minFilter,
      },
    }).fetch()
    onData(null, {
      eggs,
    })
  }
}

const mapStateToProps = (state) => ({
  minFilter: state.counter.get('count'),
})

const mapDispatchToProps = dispatch => ({
  increaseEggWalkCount(eggId) {
    dispatch(increaseEggWalkCount(eggId, 1))
  },
})

const LoadingComponent = () => <div>Hmmm...</div>
const ErrorComponent = ({
  error,
}) => <div>Error: {error.message}</div>

ErrorComponent.propTypes = {
  error: PropTypes.object.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(composeWithTracker(composer, LoadingComponent, ErrorComponent)(EggsList))
