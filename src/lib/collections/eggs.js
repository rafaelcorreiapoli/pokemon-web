import { Mongo } from 'meteor/mongo'
const Eggs = new Mongo.Collection('eggs')
export default Eggs

Eggs.static = {}
Eggs.static.proccessEggs = (botId, eggs) => {
  eggs.forEach(egg => {
    Eggs.upsert({
      _id: egg.eggIdNumber,
    }, {
      $set: {
        _id: egg.eggIdNumber,
        ...egg,
        botId,
      },
    })
  })
}
