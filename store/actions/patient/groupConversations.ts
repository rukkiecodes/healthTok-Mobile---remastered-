import {
  collection, query, where, getDocs, orderBy, limit, startAfter,
  doc, getDoc, QueryDocumentSnapshot, DocumentData
} from 'firebase/firestore';
import { db, auth } from '@/utils/fb';
import { AppDispatch } from '@/store/store';
import {
  setConversations,
  addConversations,
  setLastVisible,
  setLoading,
  setFilteredConversations
} from '@/store/slices/patient/groupChat';
import { Profile } from '@/store/types/patient/profile';

const fetchProfileByUID = async (uid: string): Promise<Profile | null> => {
  try {
    const ref = doc(db, 'users', uid);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? (snapshot.data() as Profile) : null;
  } catch (error) {
    return null;
  }
};

export const fetchGroupChats: any = () => {
  return async (dispatch: AppDispatch, getState: any) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      dispatch(setLoading(true));

      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid),
        where('isGroup', '==', true),
        orderBy('createdAt', 'desc'),
        limit(30)
      );

      const snapshot = await getDocs(q);
      const groupChats: any[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();

        // Optionally enrich with group admin or member profile data
        const membersProfiles: Profile[] = await Promise.all(
          data.participants
            .filter((uid: string) => uid !== user.uid)
            .map((uid: string) => fetchProfileByUID(uid))
        );

        groupChats.push({
          id: docSnap.id,
          ...data,
          membersProfiles,
        });
      }

      // Dispatch to a new slice or reuse `setConversations` if groups are handled together
      dispatch(setConversations(groupChats));

    } catch (error) {
      console.error('Error fetching group chats:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};


// 🔍 Client-side search
export const searchConversations: any = (searchTerm: string) => {
  return async (dispatch: AppDispatch, getState: any) => {
    const { conversations } = getState().conversations;
    const term = searchTerm.toLowerCase();

    const filtered = conversations.filter((chat: any) =>
      chat.otherProfile?.name?.toLowerCase().includes(term)
    );

    dispatch(setFilteredConversations(filtered));
  };
};
