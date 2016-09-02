import React, { PropTypes } from 'react'
import { composeWithTracker } from 'react-komposer'
import { Tracker } from 'meteor/tracker'
import { setUser } from '@ducks/user'
import { connect } from 'react-redux'

class MeteorProvider extends React.Component {
  static propTypes = {
    refreshUser: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    user: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const { user } = props
    props.refreshUser(user)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user) {
      this.props.refreshUser(nextProps.user)
    }
  }

  render() {
    return this.props.children
  }
}

const composer = (props, onData) => {
  const c = Tracker.autorun(() => {
    const user = Meteor.user()

    onData(null, {
      user,
    })
  })

  return c.stop
}

const mapStateToProps = (state, ownProps) => ({
  user: ownProps.user,
})

const mapDispatchToProps = dispatch => ({
  refreshUser(user) {
    dispatch(setUser(user))
  }
})

const connected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MeteorProvider)

export default composeWithTracker(composer)(connected)
