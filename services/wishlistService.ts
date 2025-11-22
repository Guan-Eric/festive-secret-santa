import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase';
import { WishlistItem } from '../types/index';

export const addWishlistItem = async (itemData: Partial<WishlistItem>) => {
  return await addDoc(collection(db, 'wishlistItems'), {
    ...itemData,
    createdAt: serverTimestamp(),
  });
};

export const getWishlistItems = async (userId: string, groupId: string) => {
  const q = query(
    collection(db, 'wishlistItems'),
    where('userId', '==', userId),
    where('groupId', '==', groupId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WishlistItem));
};

export const deleteWishlistItem = async (itemId: string) => {
  return await deleteDoc(doc(db, 'wishlistItems', itemId));
};