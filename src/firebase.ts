import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  QuerySnapshot,
  addDoc,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  DocumentData,
  where,
  orderBy,
} from "firebase/firestore";
import { useQuery } from "react-query";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MSMT_ID,
};

// Initialize Firebase
// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// const currentUser = auth.currentUser;
// console.log(currentUser);

//firestore 생성 테스트

export interface StoreDoc {
  id: string;
  phone: string;
  storeName: string;
  address: string;
  stationList: string[];
  x: string;
  y: string;
}

interface ReviewDoc {
  reviewID: string;
  date: string;
  user: {
    email: string | null | undefined;
    displayName: string | null | undefined;
    uid: string | undefined;
  };
  flavor: string;
  richness: string;
  text: string;
  rating: string;
}

interface ReviewDocProp {
  id: string;
  reviewID: string;
  review: ReviewDoc;
}

// const storeCollectionRef = collection(db, "stores");

// export const addStore = async (doc: StoreDoc) => {
//   try {
//     const res = await addDoc(storeCollectionRef, doc);
//     console.log(res);
//   } catch (e) {
//     throw new Error("Error");
//   }
// };

//setDoc도 유즈쿼리써서 업데이트 후 데이터 다시 받아오게끔해야함.

export const setDocStore = async (formDoc: StoreDoc) => {
  const id = formDoc.id;
  const storeRef = doc(db, "stores", id);
  try {
    const res = await setDoc(storeRef, formDoc, { merge: true });
    console.log(res);
  } catch (e) {
    throw new Error("Error");
  }
};

export const setDocReview = async ({ id, reviewID, review }: ReviewDocProp) => {
  const reviewRef = doc(db, "stores", id, "review", reviewID);
  try {
    const res = await setDoc(reviewRef, review, { merge: true });
    console.log(res);
  } catch (e) {
    throw new Error("Error");
  }
};

//페이지화 추가필요
export const getReviewList = async (id: string | undefined) => {
  if (id === undefined) return;
  const q = query(
    collection(db, "stores", id, "review"),
    orderBy("date", "desc")
  );
  try {
    const snapShot = await getDocs(q);
    const reviewList: DocumentData | null = [];
    snapShot.forEach((doc) => {
      reviewList.push(doc.data());
    });
    return reviewList;
  } catch (e) {
    throw new Error("Error");
  }
};

// export const getRate = async (id: string | undefined) => {
//   if (id === undefined) return;
//   const q = query(
//     collection(db, "stores", id, "review"),
//     where("rating", "==", "5")
//   );
//   try {
//     const snapShot = await getDocs(q);
//     const rateList: DocumentData | null = [];
//     snapShot.forEach((doc) => {
//       rateList.push(doc.data());
//     });
//     return rateList;
//   } catch (e) {
//     throw new Error("Error");
//   }
// };

export const getDocStore = async (id: string | undefined) => {
  if (id === undefined) return;
  const storeRef = doc(db, "stores", id);
  try {
    const docSnap = await getDoc(storeRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) {
    throw new Error("Error");
  }
};

// export const useGetStore = (id: string | undefined) => {
//   if (id === undefined) return;
//   const { data, isLoading, error } = useQuery(["storeInfo", id], () =>
//     getDocStore(id)
//   );
//   return { data, isLoading, error };
// };

//데이터구조
/**
- 컬렉션 -카페

—문서: 업체1,업체2 …

—데이터: 업체주소, 지도, 평균평점, 리뷰수, 리뷰, 근처지하철역 담은 배열

- (리뷰의 하위 컬렉션): 리뷰텍스트, 사진, 작성자, 작성날짜,댓글
 */
