import { db } from "./firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

export const fetchAvailableNames = async () => {
    const q = query(collection(db, "users"), where("status", "==", false));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const markNameAsTaken = async (id) => {
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, { status: true });
};