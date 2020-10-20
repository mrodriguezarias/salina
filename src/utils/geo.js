const degreesToRadians = (degrees) => {
  return (degrees * Math.PI) / 180
}

const geoUtils = {
  getDistance: (pos1, pos2) => {
    let { longitude: lon1, latitude: lat1 } = pos1
    let { longitude: lon2, latitude: lat2 } = pos2
    const earthRadiusKm = 6371
    const dLat = degreesToRadians(lat2 - lat1)
    const dLon = degreesToRadians(lon2 - lon1)
    lat1 = degreesToRadians(lat1)
    lat2 = degreesToRadians(lat2)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return earthRadiusKm * c * 1000
  },
}

export default geoUtils
