import { Meteor } from 'meteor/meteor'
import Pokesnipers from '@collections/pokesnipers'

Meteor.publish('pokesnipers', () =>
  Pokesnipers.find({
    expirationDate: {
      $gte: new Date()
    }
  })
)
