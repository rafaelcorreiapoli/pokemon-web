import { Meteor } from 'meteor/meteor'
import Eggs from '@collections/eggs'

Meteor.publish('eggs', ({ botId }) =>
  Eggs.find({ botId })
)
