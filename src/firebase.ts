// Import the functions you need from the SDKs you need
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

const docSnap = await getDocs(storeCollectionRef);
docSnap.forEach((doc) => {
  console.log(doc.data());
});

//카카오 로컬 테스트
//리뷰 작성시 기존 데이터 없을때 카카오통해서 업체 검색 -> x,y값기준 근처 지하철역검색결과를 포함한 데이터 생성해서 firestore에 저장
//리뷰 검색할때 지하철역 기준으로도 검색 할 수 있도록.

const KAKAO_REST_API_KEY = "6141e6d9b8577c45a9f067edf98ffea3";

interface documents {
  place_name: string;
}

async function getStation(x: string, y: string) {
  const { data } = await axios.get(
    `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=SW8&y=${y}&x=${x}&radius=1000`,
    {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    }
  );
  const stationList = data.documents.map((data: documents) => data.place_name);
  return stationList;
}

async function getSearchedStoreInfo(storeName: string) {
  const { data } = await axios.get(
    `https://dapi.kakao.com/v2/local/search/keyword.json?category_group_code=CE7&query=${storeName}`,
    {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    }
  );
  //업체명으로 검색된 여러 결과들 정보
  const placeInfo = data.documents;
  return placeInfo;

  //이후에 그중에서 선택된 업체에 대해 x,y좌표 뽑아서 getStation호출해야함
  // const station = getStation(placeInfo.x, placeInfo.y);
}
const location = getSearchedStoreInfo("스트라다");
console.log(location);
