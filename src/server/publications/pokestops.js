import { Meteor } from 'meteor/meteor'
import Pokestops from '@collections/pokestops'

Meteor.publish('pokestops', function({ latitude, longitude } = {}) {
  if (!latitude || !longitude) {
    return this.ready()
  }
  const results = Pokestops.find({
    loc: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: 2000,
        $minDistance: 0,
      },
    },
  })
  return results
})
