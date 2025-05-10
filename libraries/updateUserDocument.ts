import { auth, db } from "@/utils/fb"
import { doc, updateDoc } from "firebase/firestore"

export async function updateUser (collection: string, data: { [key: string]: any }) {
  await updateDoc(doc(db, collection, String(auth.currentUser?.uid)), data)
}