import { Meteor } from 'meteor/meteor'
import Bots from '@collections/bots'
import { check } from 'meteor/check'
import Encounters from '@collections/encounters'

const validateBot = (botId, userId) => {
  check(botId, String)
  const bot = Bots.findOne(botId)
  if (bot.userId !== userId) throw new Meteor.Error('not-bot-owner')
  return bot
}
const checkIsLoggedIn = () => {
  const userId = Meteor.userId()
  if (userId) {
    return userId
  }
  throw new Meteor.Error('not-authorized')
}

Meteor.methods({
  'bots.encounterPokemon'({ botId, encounterIdNumber }) {
    this.unblock();
    check(encounterIdNumber, String)
    const userId = checkIsLoggedIn()
    validateBot(botId, userId)

    // Optimistic UI
    Bots.update(botId, {
      $set: {
        currentEncounter: encounterIdNumber,
      },
    })
  },
  'bots.changeAngle'({ botId, direction }) {
    const userId = checkIsLoggedIn()
    validateBot(botId, userId)
    const bot = Bots.findOne(botId)
    let { angle = 0 } = bot
    if (isNaN(angle) || !angle) angle = 0
    let newAngle

    if (direction === 1) {
      const normalizedAngle = (angle - 360 / 36) % 360
      newAngle = normalizedAngle < 0 ? 360 + normalizedAngle : normalizedAngle
    } else if (direction === -1) {
      newAngle = (angle + 360 / 36) % 360
    }

    if (angle !== newAngle) {
      return Bots.update(botId, {
        $set: {
          angle: newAngle,
        },
      })
    }
  },

  'bots.walk'({ botId, direction }) {
    const userId = checkIsLoggedIn()
    const bot = validateBot(botId, userId)
    const { angle = 0, coords: { latitude, longitude } } = bot
    const dLat = Math.sin((angle + 90) / 180 * Math.PI) * 0.0005 * direction
    const dLng = Math.cos((angle + 90) / 180 * Math.PI) * 0.0005 * direction
    const newLatitude = latitude + dLat
    const newLongitude = longitude + dLng
    return Bots.update(botId, {
      $set: {
        coords: {
          latitude: newLatitude,
          longitude: newLongitude,
        },
      },
    })
  },
})
