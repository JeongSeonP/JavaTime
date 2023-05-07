import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";

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
const storeCollectionRef = collection(db, "stores");

const addStore = async () => {
  try {
    const res = await addDoc(storeCollectionRef, {
      name: "결",
      address: "주소",
    });
    console.log(res);
  } catch (e) {
    throw new Error("Error");
  }
};
// addStore();

const getStore = async () => {
  try {
    const docSnap = await getDocs(storeCollectionRef);
    docSnap.forEach((doc) => {
      console.log(doc.data());
    });
    console.log(docSnap);
  } catch (e) {
    throw new Error("Error");
  }
};
// getStore();

//데이터구조
/**
- 컬렉션 -카페

—문서: 업체1,업체2 …

—데이터: 업체주소, 지도, 평균평점, 리뷰수, 리뷰, 근처지하철역 담은 배열

- (리뷰의 하위 컬렉션): 리뷰텍스트, 사진, 작성자, 작성날짜,댓글
 */
