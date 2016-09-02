import { check } from 'meteor/check'
import Eggs from 'lib/collections/eggs'

Meteor.methods({
  'eggs.increaseEggWalkCount'({ eggId, quantity }) {
    check(eggId, String)
    check(quantity, Number)

    if (Meteor.isServer) {
      console.log('simulating delay')
      Meteor._sleepForMs(1000)
    }

    return Eggs.update(eggId, {
      $inc: {
        walkedStart: quantity,
      },
    })
  },
})
