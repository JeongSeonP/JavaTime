import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
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
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { DeleteOption, ReviewDocumentData } from "../pages/StorePage";
import { favoriteFlavor, favoriteType } from "../components/SelectOptions";
import { UserDocumentData } from "../pages/MyPage";
import { StoreDocumentData } from "../components/Table";

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
export const storage = getStorage(app);

export interface StoreDoc {
  id: string;
  phone: string;
  storeName: string;
  address: string;
  stationList: string[];
  x: string;
  y: string;
}

// interface StoreDocProp {
//   newDoc: StoreDoc;
//   rating: string;
// }

interface ReviewDoc {
  reviewID: string;
  date: string;
  user: {
    email: string | null | undefined;
    displayName: string | null | undefined;
    uid: string | undefined;
    photo: string | null | undefined;
  };
  flavor: string;
  richness: string;
  text: string;
  rating: string;
  image: string | null;
  comments: CommentProp[] | null;
  isRevised: boolean;
}
export interface ReviewDocData {
  reviewID: string;
  date: string;
  user: {
    email: string;
    displayName: string | null;
    uid: string;
    photo: string | null | undefined;
  };
  flavor: "sour" | "nutty";
  richness: "rich" | "bland" | "bitter";
  text: string;
  rating: string;
  image: string | null;
  comments: CommentProp[] | null;
  isRevised: boolean;
}

interface ReviewDocProp {
  prevRating: string | null;
  id: string;
  newDoc: StoreDoc;
  reviewID: string;
  review: ReviewDoc;
}

// interface DeleteCommentProp {
//   storeId: string;
//   reviewID: string;
//   commentId: number;
// }

export interface UpdateCommentProp {
  newDoc: CommentProp | null;
  storeId: string;
  reviewId: string;
  commentId: number | null;
  newText: string | null;
}

export interface CommentProp {
  text: string;
  date: string;
  commentId: number;
  userInfo: {
    displayName: string | null;
    email: string | null;
    uid: string;
  };
  isRevised: boolean;
}

// export interface CommentDocProp {
//   storeId: string;
//   reviewId: string;
//   comment: CommentProp;
// }

// export const setDocStore = async ({ newDoc, rating }: StoreDocProp) => {
//   const id = newDoc.id;
//   const storeRef = doc(db, "stores", id);
//   try {
//     await setDoc(storeRef, newDoc, { merge: true });
//     await updateDoc(storeRef, {
//       ttlRate: increment(Number(rating)),
//       ttlParticipants: increment(1),
//     });
//   } catch (e) {
//     throw new Error("Error");
//   }
// };

//리뷰수정일경우 분기처리
//처음등록일경우도 storeupdate여기안에
export const setDocReview = async ({
  prevRating,
  id,
  newDoc,
  reviewID,
  review,
}: ReviewDocProp) => {
  const reviewRef = doc(db, "stores", id, "review", reviewID);
  const storeRef = doc(db, "stores", id);
  try {
    if (!prevRating) {
      await setDoc(storeRef, newDoc, { merge: true });
      await updateDoc(storeRef, {
        ttlRate: increment(Number(review.rating)),
        ttlParticipants: increment(1),
      });

      await setDoc(reviewRef, review, { merge: true });
    } else {
      const updatedRating = Number(review.rating) - Number(prevRating);
      await updateDoc(storeRef, {
        ttlRate: increment(updatedRating),
      });
      // await setDoc(reviewRef, review, { merge: true });
      await updateDoc(reviewRef, {
        flavor: review.flavor,
        richness: review.richness,
        text: review.text,
        rating: review.rating,
        image: review.image,
        isRevised: review.isRevised,
      });
    }
  } catch (e) {
    throw new Error("Error");
  }
};

export const deleteReview = async ({
  storeId,
  reviewID,
  rating,
}: DeleteOption) => {
  const reviewRef = doc(db, "stores", storeId, "review", reviewID);
  const storeRef = doc(db, "stores", storeId);
  try {
    await deleteDoc(reviewRef);
    await updateDoc(storeRef, {
      ttlRate: increment(-Number(rating)),
      ttlParticipants: increment(-1),
    });
  } catch (e) {
    throw new Error("Error");
  }
};

// export const setDocComment = async (commentDoc: CommentDocProp) => {
//   const { storeId, reviewId, comment } = commentDoc;
//   const commentRef = doc(db, "stores", storeId, "review", reviewId);
//   try {
//     await updateDoc(commentRef, {
//       comments: arrayUnion(comment),
//     });
//   } catch (e) {
//     throw new Error("Error");
//   }
// };

export const updateComment = async ({
  newDoc,
  storeId,
  reviewId,
  commentId,
  newText,
}: UpdateCommentProp) => {
  const commentRef = doc(db, "stores", storeId, "review", reviewId);

  try {
    if (newDoc) {
      await updateDoc(commentRef, {
        comments: arrayUnion(newDoc),
      });
    } else {
      const docSnap = await getDoc(commentRef);
      if (docSnap.exists()) {
        const comment = docSnap.data().comments;
        const target = comment.find(
          (item: CommentProp) => item.commentId === commentId
        );
        await updateDoc(commentRef, {
          comments: arrayRemove(target),
        });
        if (newText) {
          const updatedText = { ...target, text: newText, isRevised: true };
          await updateDoc(commentRef, {
            comments: arrayUnion(updatedText),
          });
        }
      }
    }
  } catch (e) {
    throw new Error("Error");
  }
};
// revise랑 delete을 분기처리해서 한개 함수로 합치자...
// export const deleteComment = async ({
//   storeId,
//   reviewID,
//   commentId,
// }: DeleteCommentProp) => {
//   const commentRef = doc(db, "stores", storeId, "review", reviewID);

//   try {
//     const docSnap = await getDoc(commentRef);
//     if (docSnap.exists()) {
//       const comment = docSnap.data().comments;
//       const target = comment.find(
//         (item: CommentProp) => item.commentId === commentId
//       );
//       await updateDoc(commentRef, {
//         comments: arrayRemove(target),
//       });
//     }
//   } catch (e) {
//     throw new Error("Error");
//   }
// };

export const getReviewList = async (
  id: string | undefined,
  pageParam: number | string
) => {
  if (id === undefined || pageParam === null) return;
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

export const getMostPopularStores = async () => {
  const q = query(
    collection(db, "stores"),
    orderBy("ttlParticipants", "desc"),
    limit(6)
  );
  try {
    const docSnap = await getDocs(q);
    const storeList = docSnap.docs.map((doc) =>
      doc.data()
    ) as StoreDocumentData[];
    return storeList;
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

export interface UserDocProp {
  uid: string;
  userDoc: UserDoc;
}

export interface UserDoc {
  favoriteFlavor: string;
  favoriteType: string;
  isPublic: boolean;
}

export const setDocUser = async ({ uid, userDoc }: UserDocProp) => {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  try {
    await setDoc(userRef, userDoc);
  } catch (e) {
    throw new Error("Error");
  }
};

export const getDocUser = async (uid: string | undefined) => {
  if (uid === undefined) return;
  const userRef = doc(db, "users", uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserDocumentData;
    }
  } catch (e) {
    throw new Error("Error");
  }
};

//데이터구조
/**
- 컬렉션 -카페

—문서: 업체1,업체2 …

—데이터: 업체주소, 지도용 좌표, 총평점, 리뷰수, 리뷰, 근처지하철역 담은 배열

- (리뷰의 하위 컬렉션): 리뷰텍스트, 사진, 작성자, 작성날짜,댓글
 */

// -컬렉션 - 유저
// -문서: 유저1, 유저2...
// -데이터: uid, 커피취향