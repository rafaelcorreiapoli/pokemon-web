// src/client.jsx
import ReactDOM from 'react-dom';
import Root from 'client/components/Root';
import React from 'react';
import 'lib/methods'
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
