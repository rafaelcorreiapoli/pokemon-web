// src/client.jsx
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import ReactDOM from 'react-dom';
import Root from 'client/components/Root';
import React from 'react';
import 'lib/methods'
import '@collections/pokemons'
import 'client/config/accounts'
import 'client/stubs'
import Pokesnipers from '@collections/pokesnipers'

Meteor.startup(() => {
  Package['msavin:mongol'].Mongol.showCollection('eggs')
  Package['msavin:mongol'].Mongol.showCollection('pokemons')
  Package['msavin:mongol'].Mongol.showCollection('bots')
  Package['msavin:mongol'].Mongol.showCollection('encounters')
  Package['msavin:mongol'].Mongol.showCollection('pokestops')
  Package['msavin:mongol'].Mongol.showCollection('gyms')
  Package['msavin:mongol'].Mongol.showCollection('pokesnipers')

  window.addEventListener("keydown", function(e) {
      // space and arrow keys
      if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
      }
  }, false);
  
  ReactDOM.render(
    <Root />,
    document.getElementById('react-app')
  );
});
