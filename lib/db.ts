import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp,
  orderBy,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';

// User related operations
export const createUser = async (userId: string, userData: any) => {
  return await setDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateUser = async (userId: string, userData: any) => {
  return await updateDoc(doc(db, 'users', userId), {
    ...userData,
    updatedAt: serverTimestamp()
  });
};

export const getUser = async (userId: string) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

// Course related operations
export const getCourses = async () => {
  const coursesRef = collection(db, 'courses');
  const q = query(coursesRef);
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getCourse = async (courseId: string) => {
  const docRef = doc(db, 'courses', courseId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

// User progress operations
export const getUserProgress = async (userId: string, courseId: string) => {
  const progressRef = collection(db, 'progress');
  const q = query(
    progressRef, 
    where('userId', '==', userId),
    where('courseId', '==', courseId)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateUserProgress = async (progressId: string, progressData: any) => {
  return await updateDoc(doc(db, 'progress', progressId), {
    ...progressData,
    updatedAt: serverTimestamp()
  });
};

export const createUserProgress = async (progressData: any) => {
  return await addDoc(collection(db, 'progress'), {
    ...progressData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}; 