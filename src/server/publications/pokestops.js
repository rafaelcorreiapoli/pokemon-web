import { Meteor } from 'meteor/meteor'
import Pokestops from '@collections/pokestops'

Meteor.publish('pokestops', () =>
  Pokestops.find({}, {
    limit: 20,
  })
)
