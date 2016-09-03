import React, { PropTypes } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Tracker } from 'meteor/tracker'
import { setUser } from '@ducks/user'
import { connect } from 'react-redux'

class MeteorProvider extends React.Component {
  static propTypes = {
    //  refreshUser: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    // user: PropTypes.object,
  }
  componentDidMount() {
    this.c = Tracker.autorun(() => {
      const user = Meteor.user()
      this.context.store.dispatch(setUser(user))
    })
  }

  componentWillUnmount() {
    this.c.stop()
  }
  render() {
    return this.props.children
  }
}

MeteorProvider.contextTypes = {
  store: PropTypes.object,
}

// const composer = (props, onData) => {
//   const c = Tracker.autorun(() => {
//     const user = Meteor.user()
//
//     onData(null, {
//       user,
//     })
//   })
//
//   return c.stop
// }
//
// const mapStateToProps = (state, ownProps) => ({
//   user: ownProps.user,
// })
//
// const mapDispatchToProps = dispatch => ({
//   refreshUser(user) {
//     dispatch(setUser(user))
//   }
// })
//
// const connected = connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(MeteorProvider)

export default MeteorProvider
