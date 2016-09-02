import React from 'react';
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import store from '../../store';
import Routes from '../../routes'
import muiTheme from '@config/theme'
import MeteorProvider from '@components/MeteorProvider'
class Root extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Provider store={store}>
          <MeteorProvider>
            <Routes />
          </MeteorProvider>
        </Provider>
      </MuiThemeProvider>
    )
  }
}


export default Root;
