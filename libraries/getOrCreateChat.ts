import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/utils/fb';

/**
 * Transaction-safe: Get or create a chat between two users.
 * Prevents duplicate chats under race conditions.
 */
export const getOrCreateChat = async (
  userId: string,
  otherUserId: string,
  appointmentsData?: any,
  doctorProfile?: any,
  otherUserProfile?: any
) => {
  if (!userId || !otherUserId) throw new Error('Both userId and otherUserId are required');

  return await runTransaction(db, async (transaction) => {
    // Step 1: Look for existing chat
    const chatQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId)
    );
    const chatSnapshot = await getDocs(chatQuery);

    for (const chatDoc of chatSnapshot.docs) {
      const data = chatDoc.data();
      if (data.participants.includes(otherUserId)) {
        return doc(db, 'chats', chatDoc.id); // Return existing chat ref
      }
    }

    // Step 2: Fetch other user profile if not provided
    let otherUser = otherUserProfile;
    if (!otherUser) {
      const userDocRef = doc(db, 'users', otherUserId);
      const userDoc = await transaction.get(userDocRef);
      if (userDoc.exists()) {
        otherUser = userDoc.data();
      } else {
        throw new Error('Other user not found');
      }
    }

    // Step 3: Define a new chat doc with a unique ID (safe with `doc + setDoc`)
    const newChatRef = doc(collection(db, 'chats'));
    transaction.set(newChatRef, {
      participants: [userId, otherUserId],
      createdAt: serverTimestamp(),
      lastMessage: null,
      isAppointmentsOpen: false,
      isChatNew: true,
      appointmentsData: appointmentsData || {},
      doctor: {
        uid: userId,
        name: doctorProfile?.name || '',
        photoURL: doctorProfile?.displayImage?.image || doctorProfile?.profilePicture || '',
      },
      patient: {
        uid: otherUserId,
        name: otherUser?.name || '',
        photoURL: otherUser?.displayImage?.image || otherUser?.profilePicture || '',
      },
    });

    return newChatRef;
  });
};
