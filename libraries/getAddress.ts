import * as Location from 'expo-location';

/**
 * Gets a human-readable address from latitude and longitude using Expo Location.
 *
 * @param latitude - The user's latitude
 * @param longitude - The user's longitude
 * @returns The address as a string or null if not found
 */
export const getAddressFromCoords = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (address) {
      const {
        name,
        street,
        city,
        region,
        postalCode,
        country,
      } = address;

      return `${name || ''} ${street || ''}, ${city || ''}, ${region || ''} ${postalCode || ''}, ${country || ''}`.trim();
    }

    return null;
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return null;
  }
};
