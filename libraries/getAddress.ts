import * as Location from 'expo-location';

/**
 * Gets the city and country from latitude and longitude using Expo Location.
 *
 * @param latitude - The user's latitude
 * @param longitude - The user's longitude
 * @returns The location string or null if not found
 */
export const getAddressFromCoords = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (address) {
      const { city, country } = address;
      return `${city || ''}, ${country || ''}`.trim().replace(/^,|,$/g, '');
    }

    return null;
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return null;
  }
};
