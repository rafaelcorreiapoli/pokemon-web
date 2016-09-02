import React from 'react';
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import store from '../../store';
import Routes from '../../routes'
import muiTheme from '@config/theme'

class Root extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Provider store={store}>
          <Routes />
        </Provider>
      </MuiThemeProvider>
    )
  }
}


export default Root;
