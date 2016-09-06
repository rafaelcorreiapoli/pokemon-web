import geolib from 'geolib'

export const calculateRoutePlan = (origin, destination, metersPerStep) => {
  const routePlanPoints = []
  const deltaLongitude = destination.longitude - origin.longitude
  const deltaLatitude = destination.latitude - origin.latitude
  const distance = geolib.getDistance(origin, destination);
  const necessarySteps = Math.ceil(distance / metersPerStep);
  const dLongitude = deltaLongitude / necessarySteps
  const dLatitude = deltaLatitude / necessarySteps

  for (let i = 0; i < necessarySteps; i++) {
    routePlanPoints.push({
      latitude: origin.latitude + (dLatitude * i),
      longitude: origin.longitude + (dLongitude * i),
    })
  }
  routePlanPoints.push(destination)
  console.log(routePlanPoints)
  return routePlanPoints
}
