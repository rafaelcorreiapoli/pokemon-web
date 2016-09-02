import Eggs from 'lib/collections/eggs'
import { Meteor } from 'meteor/meteor'
// 
// Meteor.publish('eggs', () => {
//   Meteor._sleepForMs(1000)
//   //  throw new Meteor.Error('something weird happened')
//   return Eggs.find()
// })

Meteor.isServer && Meteor.startup(() => {
  if (Eggs.find().count() === 0) {
    for (let i = 0; i < 10; i++) {
      Eggs.insert({
        walkedStart: 0,
        walkedTarget: 10,
      })
    }
  }
})
