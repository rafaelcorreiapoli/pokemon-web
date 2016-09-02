import { Meteor } from 'meteor/meteor'
import Pokemons from '@collections/pokemons'

Meteor.publish('pokemons', ({ botId }) =>
  Pokemons.find({ botId })
)
