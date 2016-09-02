// src/client.jsx
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import ReactDOM from 'react-dom';
import Root from 'client/components/Root';
import React from 'react';
import 'lib/methods'
import '@collections/pokemons'
import 'client/config/accounts'

import { Accounts } from 'meteor/accounts-base'
Accounts.onLogin(function (info) {
  console.log('infos', info)
});
Meteor.startup(() => {
  Package['msavin:mongol'].Mongol.showCollection('eggs')
  Package['msavin:mongol'].Mongol.showCollection('pokemons')
  Package['msavin:mongol'].Mongol.showCollection('bots')
  Package['msavin:mongol'].Mongol.showCollection('encounters')
  Package['msavin:mongol'].Mongol.showCollection('pokestops')
  Package['msavin:mongol'].Mongol.showCollection('gyms')

  ReactDOM.render(
    <Root />,
    document.getElementById('react-app')
  );
});
