import { Mongo } from 'meteor/mongo'
const Bots = new Mongo.Collection('bots')
Bots.static = {}

Bots.static.setPosition = (botId, { latitude, longitude }) => {
  Bots.update(botId, {
    $set: {
      coords: {
        latitude,
        longitude,
      },
    },
  })
}

Bots.static.selectBot = (userId, botId) => {
  Bots.update({
    _id: {
      $ne: botId,
    },
    userId,
  }, {
    $set: {
      selected: false,
    },
  }, {
    multi: true,
  })
  Bots.update(botId, {
    $set: {
      selected: true,
    },
  })
}

Bots.static.changeAngle = (botId, direction, step) => {
  let newAngle
  let { angle } = Bots.findOne(botId)

  if (isNaN(angle)) {
    angle = 0
  }

  if (direction === 1) {
    const normalizedAngle = (angle - 360 / step) % 360
    newAngle = normalizedAngle < 0 ? 360 + normalizedAngle : normalizedAngle
  } else if (direction === -1) {
    newAngle = (angle + 360 / step) % 360
  }
  if (angle !== newAngle) {
    Bots.update(botId, {
      $set: {
        angle: newAngle,
      },
    })
  }
}

Bots.static.setProfile = (botId, profile) => {
  const {
    level,
    uniquePokedex,
    items,
    candies,
  } = profile
  Bots.update(botId, {
    $set: {
      'pokemonGoProfile.level': level,
      'pokemonGoProfile.uniquePokedex': uniquePokedex,
      'pokemonGoProfile.items': items,
      'pokemonGoProfile.candies': candies,
    },
  })
}
export default Bots
