import { Meteor } from 'meteor/meteor'
import Encounters from '@collections/encounters'

Meteor.publish('encounters', () =>
  Encounters.find({
    expirationDate: {
      $gte: new Date(),
    },
  })
)
