import { Mongo } from 'meteor/mongo'
const Pokestops = new Mongo.Collection('pokestops')

Pokestops.static = {}
Pokestops.static.getClosestPokestop = ({ latitude, longitude, maxDistance, minDistance }) => {
  const $near = {
    $geometry: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
  }
  if (maxDistance) {
    $near.$maxDistance = maxDistance
  }
  if (minDistance) {
    $near.$minDistance = minDistance
  }

  return Pokestops.findOne({
    loc: {
      $near,
    },
  }, {
    limit: 1,
  })
}

Pokestops.static.proccessPokestops = (pokestops) => {
  pokestops.forEach(({ pokestopId, ...pokestop }) => {
    const loc = {
      type: 'Point',
      coordinates: [pokestop.longitude, pokestop.latitude],
    }

    Pokestops.upsert({
      _id: pokestopId,
    }, {
      $set: {
        _id: pokestopId,
        loc,
        ...pokestop,
      },
    })
  })
}

export default Pokestops
