import { Meteor } from 'meteor/meteor'
import Bots from '@collections/bots'

Meteor.publish('bots', () => Bots.find())

Meteor.publish('bots.profile', ({ botId }) =>
  Bots.find({
    _id: botId,
  })
)
