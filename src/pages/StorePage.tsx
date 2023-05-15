import { useParams } from "react-router-dom";
import { getDocStore, getReviewList } from "../firebase";
import { DocumentData } from "firebase/firestore";
import { Key, useEffect, useState } from "react";
import KakaoMap from "../components/KakaoMap";
import { useInfiniteQuery, useQuery } from "react-query";
import StoreInfo from "../components/StoreInfo";
import { flavorList, richnessList } from "../components/SelectOptions";
import StarRate from "../components/StarRate";
import { queryClient } from "../App";

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
  flavor: "sour" | "nutty";
  richness: "rich" | "bland" | "bitter";
  text: string;
  rating: string;
}

export interface ReviewDocumentData extends DocumentData {
  reviewList: ReviewDoc[];
  nextPage: string;
  hasNextPage: boolean;
}

const StorePage = () => {
  const { storeId } = useParams();
  const [storeInfo, setStoreInfo] = useState<DocumentData | null>(null);
  const [isLast, setIsLast] = useState(false);
  // const [review, setReview] = useState<ReviewDoc[] | null>(null);
  const [reviewInfo, setReviewInfo] = useState({
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
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ReviewDocumentData | undefined>(
    ["reviewInfo", storeId],
    ({ pageParam = 0 }) => getReviewList(storeId, pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage) {
          if (lastPage.reviewList.length < 5) return null;
          return lastPage.nextPage;
        }
      },
    }
  );

  useEffect(() => {
    if (reviewDoc?.pages && reviewDoc.pages?.length > 0) {
      const isLast = reviewDoc?.pages[reviewDoc.pages.length - 1]?.hasNextPage
        ? false
        : true;

      setIsLast(isLast);
    }
  }, [reviewDoc]);

  //로딩컴포넌트만들기
  //리뷰에 댓글기능도 필요

  useEffect(() => {
    if (storeDoc) {
      setStoreInfo(storeDoc);
    }
  }, [storeDoc]);

  const handlePage = () => {
    // setPage((page) => page + 1);
    fetchNextPage();
    console.log("isFetchingNextPage", isFetchingNextPage);
  };

  if (isLoading) {
    return <main>loading..</main>;
  }
  if (!storeInfo || error) {
    return <main>업체정보가 없습니다.</main>;
  }

  return (
    <main className="pt-10 pb-20">
      <div className=" w-4/5 mx-auto text-center flex flex-col justify-center items-center">
        <h2 className="font-semibold  mb-4 text-lg flex justify-center items-center mx-auto w-fit px-7 h-12 rounded-full shadow ">
          {storeInfo.storeName}
        </h2>
        <StoreInfo info={storeInfo} />
        {/* <KakaoMap mapOption={mapOption} /> */}
        <ul className="md:w-full max-w-xl w-[350px] text-xs md:text-sm">
          {reviewDoc?.pages.map((page) =>
            page?.reviewList.map((review: ReviewDoc) => (
              <li
                key={review.reviewID}
                className="w-full text-right border-2 border-base-200 rounded-xl bg-[#fff] my-2 p-3"
              >
                <div className="flex justify-between mb-1">
                  <div className="text-secondary-content">
                    {review.user.displayName
                      ? review.user.displayName
                      : review.user.email}
                  </div>
                  <div className="flex justify-end ">
                    <span className="inline-block mt-0.5 font-semibold text-secondary-content">
                      {review.rating}
                    </span>
                    <StarRate rate={review.rating} />
                  </div>
                </div>
                <div className="flex text-xs justify-end text-primary-dark-color">
                  <div className="mx-2">
                    <i className="ico-coffeeBean mr-1 text-[9px]"></i>
                    {flavorList[review.flavor]}
                  </div>
                  <div>
                    <i className="ico-coffeeBean mr-1 text-[9px]"></i>
                    {richnessList[review.richness]}
                  </div>
                </div>
                <div className="text-left p-2 md:indent-3 border border-base-200 rounded-xl shadow-sm my-1">
                  {review.text}
                </div>

                <div className="italic rounded-xl bg-base-200 px-2">
                  date: {review.date}
                </div>
              </li>
            ))
          )}
        </ul>
        {!isLast ? (
          <button
            onClick={handlePage}
            className="btn btn-ghost w-3/4 bg-base-200 hover:bg-base-300"
          >
            더보기
          </button>
        ) : null}
      </div>
    </main>
  );
};

export default StorePage;
