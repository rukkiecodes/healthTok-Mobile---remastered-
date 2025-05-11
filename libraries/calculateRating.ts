import { db } from '@/utils/fb';
import { getDocs, collection } from 'firebase/firestore';

/**
 * Fetches and calculates the average rating (rounded to nearest 0.5)
 * from the "ratings" subcollection.
 *
 * @param id - Document ID of the rated item
 * @param parentCollection - Collection containing the item
 */
export const getAverageRating = async (
  id: string,
): Promise<number> => {
  try {
    const snapshot = await getDocs(collection(db, 'doctors', id, 'ratings'));
    const values = snapshot.docs.map(doc => doc.data().rating);
    const total = values.reduce((sum, val) => sum + val, 0);

    const average = values.length > 0 ? total / values.length : 0;

    // Round to the nearest 0.5
    return Math.round(average * 2) / 2;
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return 0;
  }
};
