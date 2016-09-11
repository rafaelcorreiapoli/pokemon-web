import { Mongo } from 'meteor/mongo'
const Encounters = new Mongo.Collection('encounters')

Encounters.static = {}
Encounters.static.proccessEncounters = (encounters) => {
  encounters.forEach(({ encounterIdNumber, ...encounter }) => {
    Encounters.upsert({
      _id: encounterIdNumber,
    }, {
      $set: {
        _id: encounterIdNumber,
        ...encounter,
      },
    })
  })
}

export default Encounters
