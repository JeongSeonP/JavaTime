import { useParams } from "react-router-dom";
import { getDocStore, getReviewList } from "../firebase";
import { DocumentData } from "firebase/firestore";
import { Key, useEffect, useState } from "react";
import KakaoMap from "../components/KakaoMap";
import { useQuery } from "react-query";
import StoreInfo from "../components/StoreInfo";

// interface Document {
//   id: string;
//   phone: string;
//   storeName: string;
//   address: string;
//   x: string;
//   y: string;
//   stationList: string[];
// }

interface ReviewDoc {
  reviewID: string;
  date: string;
  user: {
    email: string;
    displayName: string | null;
    uid: string;
  };
  flavor: string;
  richness: string;
  text: string;
  rating: string;
}

const StorePage = () => {
  const { storeId } = useParams();
  const [storeInfo, setStoreInfo] = useState<DocumentData | null>(null);
  const [reviewInfo, setreviewInfo] = useState({
    reviewLength: 0,
    averageRate: "",
  });
  const {
    data: storeDoc,
    isLoading,
    error,
  } = useQuery(["storeInfo", storeId], () => getDocStore(storeId));
  const {
    data: reviewDoc,
    isLoading: isReviewLoading,
    error: isReviewError,
  } = useQuery(["reviewInfo", storeId], () => getReviewList(storeId));

  useEffect(() => {
    if (reviewDoc) {
      const reviewLength = reviewDoc.length;
      const averageRate = (
        reviewDoc
          .map((review: ReviewDoc) => Number(review.rating))
          .reduce((a: number, b: number) => a + b) / reviewLength
      ).toFixed(1);

      setreviewInfo({
        reviewLength: reviewLength,
        averageRate: averageRate,
      });
    }
  }, [reviewDoc]);

  //로딩컴포넌트만들기
  //리뷰에 댓글기능도 필요

  useEffect(() => {
    if (storeDoc) {
      setStoreInfo(storeDoc);
    }
  }, [storeDoc]);

  if (isLoading) {
    return <main>loading..</main>;
  }
  if (!storeInfo || error) {
    return <main>업체정보가 없습니다.</main>;
  }

  return (
    <main className="pt-10 pb-20">
      <div className=" w-4/5 mx-auto text-center flex flex-col justify-center items-center">
        <h2 className="font-semibold mb-4 text-lg">{storeInfo.storeName}</h2>
        <StoreInfo info={storeInfo} reviewInfo={reviewInfo} />
        {reviewDoc?.map((review: ReviewDoc) => (
          <div key={review.reviewID}>
            <div>{review.date}</div>
            <div>{review.rating}</div>
            <div>{review.text}</div>
            <div>
              {review.user.displayName
                ? review.user.displayName
                : review.user.email}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default StorePage;
