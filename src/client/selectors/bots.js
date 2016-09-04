import { Meteor } from 'meteor/meteor'

export const getSelectedBotDocument = (Bots, selectedBot) =>
  Bots.findOne(selectedBot)

export const getSelectedBot = (Bots) =>
  Bots.findOne({
    selected: true,
    userId: Meteor.userId(),
  })

export const getBots = (Bots) => {
console.log(Bots)
  return Bots.find().fetch()
}
