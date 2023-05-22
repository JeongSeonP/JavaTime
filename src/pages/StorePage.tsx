import { useNavigate, useParams } from "react-router-dom";
import {
  CommentProp,
  ReviewDocData,
  auth,
  deleteReview,
  getDocStore,
  getReviewList,
  updateComment,
} from "../api/firebase";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import StoreInfo from "../components/StoreInfo";
import { flavorList, richnessList } from "../components/SelectOptions";
import StarRate from "../components/StarRate";
import { useAuthState } from "react-firebase-hooks/auth";
import Modal from "../components/Modal";
import CommentInput from "../components/CommentInput";
import Dropdown from "../components/Dropdown";
import Comments from "../components/Comments";
import ProfileModal from "../components/ProfileModal";

export interface ReviewDocumentData extends DocumentData {
  reviewList: ReviewDocData[];
  nextPage: string;
  hasNextPage: boolean;
}

export interface DeleteOption {
  storeId: string;
  reviewID: string;
  rating: string;
}

const StorePage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLast, setIsLast] = useState(false);
  const [user] = useAuthState(auth);
  const [modal, setModal] = useState(false);
  const [deleteOption, setDeleteOption] = useState<DeleteOption | null>(null);
  const modalOption = {
    h3: "리뷰를 정말 삭제하시겠습니까?",
    p: "삭제하시려면 확인 버튼을 눌러주세요.",
    button: "확인",
    secondButton: "취소",
  };
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

  const { mutate: reviewMutate } = useMutation(deleteReview, {
    onSuccess: () => {
      queryClient.invalidateQueries(["reviewInfo", storeId]);
      queryClient.invalidateQueries(["storeInfo", storeId]);
    },
  });

  //로딩컴포넌트만들기
  //스토어정보부분이랑 리뷰부분을 컴포넌트 나눌까..

  const handlePage = () => {
    fetchNextPage();
    console.log("isFetchingNextPage", isFetchingNextPage);
  };

  const goToReview = () => {
    if (storeDoc) {
      const store = {
        id: storeDoc.id,
        phone: storeDoc.phone,
        storeName: storeDoc.storeName,
        address: storeDoc.address,
        x: storeDoc.x,
        y: storeDoc.y,
      };
      sessionStorage.setItem("selectedStore", JSON.stringify(store));
    }
    navigate("/review");
  };

  const handleRevision = (review: ReviewDocData) => {
    const revisionOption = {
      reviewID: review.reviewID,
      rating: review.rating,
      img: review.image,
      flavor: review.flavor,
      richness: review.richness,
      text: review.text,
    };
    sessionStorage.setItem("revisionOption", JSON.stringify(revisionOption));
    goToReview();
  };

  const handleDelete = (reviewID: string, rating: string) => {
    if (storeId) {
      setDeleteOption({ storeId, reviewID, rating });
    }
    setModal(true);
  };

  const confirmDelete = (answer: boolean) => {
    if (answer && deleteOption) {
      setModal(false);
      reviewMutate(deleteOption);
    } else if (!answer) {
      setModal(false);
      setDeleteOption(null);
    }
  };

  if (isLoading) {
    return <main>loading..</main>;
  }
  if (!storeDoc || error) {
    return <main>업체정보가 없습니다.</main>;
  }

  return (
    <main className="pt-10 pb-20">
      <div className=" w-4/5 mx-auto text-center flex flex-col justify-center items-center">
        <h2 className="font-semibold  mb-4 text-lg flex justify-center items-center mx-auto w-fit px-7 h-12 rounded-full shadow ">
          {storeDoc.storeName}
        </h2>
        <StoreInfo info={storeDoc} map={true} />
        <button
          onClick={goToReview}
          className="btn md:w-full max-w-xl w-[350px]"
        >
          리뷰 등록하기
        </button>
        <ul className="md:w-full max-w-xl w-[350px] text-xs md:text-sm">
          {reviewDoc?.pages.map((page) =>
            page?.reviewList.map((review: ReviewDocData) => (
              <li
                key={review.reviewID}
                className="w-full text-right border-2 border-base-200 rounded-xl bg-[#fff] my-2 p-3"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <ProfileModal user={review.user} />

                  <div className="flex justify-end items-center">
                    <span className="flex items-center my-1 font-semibold text-sm text-secondary-content">
                      {review.rating}
                    </span>
                    <StarRate rate={review.rating} />
                    {user?.uid === review.user.uid ? (
                      <Dropdown>
                        <li>
                          <div
                            onClick={() => handleRevision(review)}
                            className="text-xs pl-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              className="w-3 h-3 shrink-0"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                            <p className="shrink-0">수정</p>
                          </div>
                        </li>
                        <li className="px-0 text-error">
                          <div
                            onClick={() =>
                              handleDelete(review.reviewID, review.rating)
                            }
                            className="text-xs pl-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              className="w-3 h-3 shrink-0"
                              viewBox="0 0 16 16"
                            >
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                            </svg>
                            <p className="shrink-0">삭제</p>
                          </div>
                        </li>
                      </Dropdown>
                    ) : null}
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
                <div className="flex flex-col justify-between text-left p-2 md:indent-3 bg-[#deeaea]/60 border border-base-200 text-secondary-content rounded-xl shadow my-1 min-h-[80px]">
                  {review.image !== null ? (
                    <div className="w-28 h-28 overflow-hidden rounded-lg mb-2 shadow">
                      <img
                        src={review.image}
                        alt="리뷰이미지"
                        onClick={() => window.open(review.image as string)}
                      />
                    </div>
                  ) : null}
                  <p>{review.text}</p>

                  <div className="flex justify-end items-center italic rounded-xl bg-[#d3e5e5] px-2 shadow mt-1">
                    {review.isRevised ? (
                      <p className="mr-1 text-neutral-400 text-[10px]">
                        (편집됨)
                      </p>
                    ) : null}
                    <p>date: {review.date}</p>
                  </div>
                </div>

                <ul>
                  {review.comments
                    ? review.comments.map((comment) => (
                        <Comments
                          key={comment.commentId}
                          storeId={storeDoc.id}
                          reviewId={review.reviewID}
                          comment={comment}
                        />
                      ))
                    : null}
                </ul>

                <CommentInput
                  info={{ storeId: storeDoc.id, reviewId: review.reviewID }}
                  prevComment={null}
                  inputEditor={null}
                />
                {/* <ProfileModal /> */}
              </li>
            ))
          )}
        </ul>
        {!isLast ? (
          <button
            onClick={handlePage}
            className="btn btn-ghost w-3/4 sm:w-1/2 bg-base-200 hover:bg-base-300"
          >
            더보기
          </button>
        ) : null}
      </div>
      <Modal
        toggle={modal}
        handleRedirect={confirmDelete}
        option={modalOption}
      />
    </main>
  );
};

export default StorePage;
