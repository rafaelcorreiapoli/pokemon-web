export const getSelectedBotDocument = (Bots, selectedBot) =>
  Bots.findOne(selectedBot)
export const getBots = (Bots) => Bots.find().fetch()
