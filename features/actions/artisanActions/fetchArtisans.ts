import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, orderBy, startAfter, limit, getDocs, where, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/utils/fb";
import { Artisans } from "@/utils/types";
import getUserId from "@/libraries/uid";

const ARTISAN_LIMIT = 20;

export const fetchArtisans: any = createAsyncThunk<
  { artisans: Artisans[]; lastVisible: QueryDocumentSnapshot | null; hasMore: boolean },
  void,
  { rejectValue: string }
>(
  "artisan/fetchArtisans",
  async (_, { getState, rejectWithValue }) => {
    try {
      const uid = await getUserId();
      const state = getState() as { artisan: { lastVisible: QueryDocumentSnapshot | null } };
      const lastVisible = state.artisan.lastVisible;

      let artisanQuery = query(
        collection(db, "users"),
        where("joiningAs", "==", "artisan"),
        where("uid", "!=", uid),
        orderBy("timestamp", "desc"),
        limit(ARTISAN_LIMIT)
      );

      if (lastVisible) {
        artisanQuery = query(
          collection(db, "users"),
          where("joiningAs", "==", "artisan"),
          where("uid", "!=", uid),
          orderBy("timestamp", "desc"),
          startAfter(lastVisible),
          limit(ARTISAN_LIMIT)
        );
      }

      const snapshot = await getDocs(artisanQuery);
      const artisans: Artisans[] = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...(doc.data() as Artisans),
      }));

      const newLastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

      return { artisans, lastVisible: newLastVisible, hasMore: snapshot.docs.length === ARTISAN_LIMIT };
    } catch (error: any) {
      console.error("Error fetching artisans:", error);
      return rejectWithValue(error.message || "Failed to fetch artisans.");
    }
  }
);
