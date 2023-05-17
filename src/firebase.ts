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
  startAt,
  limit,
  startAfter,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useQuery } from "react-query";
import { ReviewDocumentData } from "./pages/StorePage";

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
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// const currentUser = auth.currentUser;
// console.log(currentUser);

export interface StoreDoc {
  id: string;
  phone: string;
  storeName: string;
  address: string;
  stationList: string[];
  x: string;
  y: string;
}

interface StoreDocProp {
  newDoc: StoreDoc;
  rating: string;
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
interface ReviewDocData {
  reviewID: string;
  date: string;
  user: {
    email: string;
    displayName: string | null;
    uid: string;
  };
  flavor: "sour" | "nutty";
  richness: "rich" | "bland" | "bitter";
  text: string;
  rating: string;
}

interface ReviewDocProp {
  id: string;
  reviewID: string;
  review: ReviewDoc;
}

export const setDocStore = async ({ newDoc, rating }: StoreDocProp) => {
  const id = newDoc.id;
  const storeRef = doc(db, "stores", id);
  try {
    await setDoc(storeRef, newDoc, { merge: true });
    await updateDoc(storeRef, {
      ttlRate: increment(Number(rating)),
      ttlParticipants: increment(1),
    });
  } catch (e) {
    throw new Error("Error");
  }
};

export const setDocReview = async ({ id, reviewID, review }: ReviewDocProp) => {
  const reviewRef = doc(db, "stores", id, "review", reviewID);
  try {
    await setDoc(reviewRef, review, { merge: true });
  } catch (e) {
    throw new Error("Error");
  }
};

export const getReviewList = async (
  id: string | undefined,
  pageParam: number | string
) => {
  if (id === undefined || pageParam === null) return;
  console.log(pageParam);
  const perPage = 5;

  if (pageParam === 0) {
    try {
      const q = query(
        collection(db, "stores", id, "review"),
        orderBy("date", "desc"),
        limit(perPage + 1)
      );
      const snapShot = await getDocs(q);
      const reviewList = snapShot.docs.map((doc) =>
        doc.data()
      ) as ReviewDocData[];
      const lastDoc = snapShot.docs[perPage - 1];
      const nextPage = lastDoc ? lastDoc.data().reviewID : null;
      const hasNextPage = nextPage ? reviewList.length === perPage + 1 : false;
      if (reviewList.length === perPage + 1) {
        reviewList.splice(5, 1);
      }
      const result: ReviewDocumentData = {
        reviewList: reviewList,
        nextPage: nextPage,
        hasNextPage: hasNextPage,
      };

      return result;
    } catch (e) {
      throw new Error("Error");
    }
  } else if (pageParam !== 0) {
    try {
      const startAfterRef = doc(db, "stores", id, "review", String(pageParam));
      const startAfterSnap = await getDoc(startAfterRef);

      if (startAfterSnap.exists()) {
        const nextQ = query(
          collection(db, "stores", id, "review"),
          orderBy("date", "desc"),
          startAfter(startAfterSnap),
          limit(perPage + 1)
        );
        const nextSnapShot = await getDocs(nextQ);
        const reviewList = nextSnapShot.docs.map((doc) =>
          doc.data()
        ) as ReviewDocData[];

        const lastDoc = nextSnapShot.docs[perPage - 1];
        const nextPage = lastDoc ? lastDoc.data().reviewID : null;
        const hasNextPage = nextPage
          ? reviewList.length === perPage + 1
          : false;
        console.log("길이", reviewList.length === perPage + 1);
        console.log("hasNextPage", hasNextPage);

        if (reviewList.length === perPage + 1) {
          reviewList.splice(5, 1);
        }
        const result: ReviewDocumentData = {
          reviewList: reviewList,
          nextPage: nextPage,
          hasNextPage: hasNextPage,
        };

        return result;
      }
    } catch (e) {
      throw new Error("Error");
    }
  }
};

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

export const findStoreByName = async (storeName: string) => {
  const q = query(
    collection(db, "stores"),
    where("storeName", "==", storeName)
  );
  try {
    const docSnap = await getDocs(q);
    const storeList = docSnap.docs.map((doc) => doc.data());
    return storeList;
  } catch (e) {
    throw new Error("Error");
  }
};

export const findStoreByStation = async (station: string) => {
  const lastword = station[station.length - 1];
  if (lastword !== "역") {
    station += "역";
  }
  console.log("station", station);
  const q = query(
    collection(db, "stores"),
    where("stationList", "array-contains", station)
  );
  try {
    const docSnap = await getDocs(q);
    const storeList = docSnap.docs.map((doc) => doc.data());
    return storeList;
  } catch (e) {
    throw new Error("Error");
  }
};

//데이터구조
/**
- 컬렉션 -카페

—문서: 업체1,업체2 …

—데이터: 업체주소, 지도, 평균평점, 리뷰수, 리뷰, 근처지하철역 담은 배열

- (리뷰의 하위 컬렉션): 리뷰텍스트, 사진, 작성자, 작성날짜,댓글
 */
