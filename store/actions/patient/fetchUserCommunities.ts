import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, auth } from '@/utils/fb';
import { AppDispatch } from '@/store/store';
import { setCommunities, setLoading as setCommunityLoading } from '@/store/slices/patient/communitiesSlice';

export const fetchUserCommunities: any = () => {
  return async (dispatch: AppDispatch) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      dispatch(setCommunityLoading(true));

      const q = query(
        collection(db, 'communities'),
        where('members', 'array-contains', user.uid),
        orderBy('createdAt', 'desc'),
        limit(30)
      );

      const snapshot = await getDocs(q);
      const communities: any = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      dispatch(setCommunities(communities));
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      dispatch(setCommunityLoading(false));
    }
  };
};
