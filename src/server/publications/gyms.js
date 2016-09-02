import { Meteor } from 'meteor/meteor'
import Gyms from '@collections/gyms'

Meteor.publish('gyms', () => Gyms.find())
