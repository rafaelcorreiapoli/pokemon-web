import React, { PropTypes } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Login from '@containers/Login'
class LoginScreen extends React.Component {
  render() {
    return <div>
      <Login redirect={this.props.location.query.redirect} />
    </div>
  }
}

export default LoginScreen;
