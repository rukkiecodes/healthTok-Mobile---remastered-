import {
  collection, query, where, getDocs, orderBy, limit, startAfter,
  doc, getDoc, QueryDocumentSnapshot, DocumentData
} from 'firebase/firestore';
import { db, auth } from '@/utils/fb';
import { AppDispatch } from '../store';
import {
  setConversations,
  addConversations,
  setLastVisible,
  setLoading,
  setFilteredConversations
} from '@/store/slices/conversationsSlice';
import { Profile } from '@/store/types/profile';

const fetchProfileByUID = async (uid: string): Promise<Profile | null> => {
  try {
    const ref = doc(db, 'users', uid);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? (snapshot.data() as Profile) : null;
  } catch (error) {
    console.error(`Error fetching profile for uid ${uid}:`, error);
    return null;
  }
};

export const fetchConversations: any = (initial = false) => {
  return async (dispatch: AppDispatch, getState: any) => {
    const user = auth.currentUser;
    if (!user) return;

    const { lastVisible } = getState().conversations;

    try {
      dispatch(setLoading(true));

      let q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid),
        orderBy('createdAt', 'desc'),
        limit(30)
      );

      if (!initial && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await getDocs(q);
      const newConversations: any[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const otherUID = data.participants.find((uid: string) => uid !== user.uid);

        const otherProfile = await fetchProfileByUID(otherUID);
        newConversations.push({
          id: docSnap.id,
          ...data,
          otherProfile,
        });
      }

      if (initial) {
        dispatch(setConversations(newConversations));
      } else {
        dispatch(addConversations(newConversations));
      }

      const lastDoc = snapshot.docs[snapshot.docs.length - 1] as QueryDocumentSnapshot<DocumentData> | undefined;
      if (lastDoc) {
        dispatch(setLastVisible(lastDoc));
      }

    } catch (error) {
      console.error('Error fetching conversations:', error);
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
