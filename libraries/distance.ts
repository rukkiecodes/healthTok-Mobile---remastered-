export function getDistanceFromLatLonInKm (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in km
}

function deg2rad (deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string {
  const distanceInKm = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);

  if (distanceInKm < 1) {
    const meters = distanceInKm * 1000;
    return `${meters.toFixed(0)} m`;
  }

  return `${distanceInKm.toFixed(2)} km`;
}