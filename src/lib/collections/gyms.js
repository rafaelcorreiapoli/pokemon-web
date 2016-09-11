import { Mongo } from 'meteor/mongo'
const Gyms = new Mongo.Collection('gyms')

Gyms.static = {}
Gyms.static.proccessGyms = (gyms) => {
  gyms.forEach(({ gymId, ...gym }) => {
    Gyms.upsert({
      _id: gymId,
    }, {
      $set: {
        _id: gymId,
        ...gym,
      },
    })
  })
}

export default Gyms
