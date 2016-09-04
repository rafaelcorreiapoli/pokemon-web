export const getEncounters = (Encounters) => Encounters.find().fetch()

export const getEncounter = (Encounters, encounterId) => Encounters.findOne(encounterId)
