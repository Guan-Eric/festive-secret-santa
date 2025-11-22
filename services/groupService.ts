import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Group } from '../types/index';

export const createGroup = async (groupData: Partial<Group>) => {
  return await addDoc(collection(db, 'groups'), {
    ...groupData,
    createdAt: serverTimestamp(),
  });
};

export const getUserGroups = async (userId: string) => {
  const q = query(
    collection(db, 'groups'),
    where('memberIds', 'array-contains', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
};

export const getGroupById = async (groupId: string) => {
  const groupDoc = await getDoc(doc(db, 'groups', groupId));
  if (groupDoc.exists()) {
    return { id: groupDoc.id, ...groupDoc.data() } as Group;
  }
  return null;
};

export const updateGroupMatching = async (groupId: string, assignments: any[]) => {
  return await updateDoc(doc(db, 'groups', groupId), {
    matched: true,
    assignments,
  });
};