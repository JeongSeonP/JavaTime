import { useNavigate } from "react-router-dom";
import FormBoard from "../components/FormBoard";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUploader, { Imagefile } from "../components/ImageUploader";
import Modal from "../components/Modal";
import { getStation } from "../api/kakaoAPI";
import { auth, setDocReview, storage } from "../api/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useMutation, useQueryClient } from "react-query";
import { Timestamp } from "firebase/firestore";
import { flavorList, richnessList } from "../components/SelectOptions";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

//이 페이지는 선택된 업체정보가 없으면 접근 못하게해야할듯.
//리뷰작성 취소할때, 등록할때 모두 selectedstore도 초기화해야할듯.
//취소하면 모달띄워보자
// form hook 써보자 - 이걸로 바꾸면서 취소버튼도 추가..
//등록하면 그때 x,y활용해서 getStation호출한담에 모든정보 모아서 setDoc해야함.

export interface ReviewForm {
  rating: string;
  flavor: string;
  richness: string;
  text: string;
}

interface RevisionOption {
  reviewID: string;
  rating: string;
  img: string | null;
}

const CreateReview = () => {
  const [modal, setModal] = useState(false);
  const [existingReview, setExistingReview] = useState<RevisionOption | null>(
    null
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user] = useAuthState(auth);
  const [imgFile, setImgFile] = useState<Imagefile | null>(null);
  const [store, setStore] = useState({
    id: "",
    phone: "",
    storeName: "",
    address: "",
    x: "",
    y: "",
  });
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit: onSubmit,
    watch,
    reset,
  } = useForm<ReviewForm>({
    mode: "onSubmit",
    defaultValues: {
      rating: "0",
      flavor: "",
      richness: "",
      text: "",
    },
  });

  const { mutate: reviewMutate, isLoading } = useMutation(setDocReview, {
    onSuccess: () => {
      queryClient.invalidateQueries(["storeInfo", store.id]);
      queryClient.invalidateQueries(["reviewInfo", store.id]);
    },
  });
  const rate = watch("rating");

  const modalOption = {
    h3: "리뷰 남기실 카페를 먼저 선택해주세요.",
    p: "아래 버튼을 누르시면 카페 선택 페이지로 이동합니다.",
    button: "카페 선택하러 가기",
    secondButton: false,
  };

  //리뷰아이디를 useState로 관리해서 세션에 있으면 셋하고
  //없을땐 createDoc에서 만든걸로 사용?
  //state에따라 등록이냐 수정이냐로
  //수정하러 들어왔다가 그냥 나갈때 세션부분 처리 필요
  useEffect(() => {
    const store = sessionStorage.getItem("selectedStore");
    if (store) {
      setStore(JSON.parse(store));
    } else if (store === null) {
      setModal(true);
    }

    const isRevision = sessionStorage.getItem("revisionOption");
    if (isRevision) {
      setExistingReview(JSON.parse(isRevision));
    }

    return () => sessionStorage.clear();
  }, []);

  useEffect(() => {
    if (existingReview?.img) {
      setImgFile({
        file: null,
        thumnail: existingReview.img,
        name: "prevImg",
      });
    }
  }, [existingReview]);

  const handleRedirect = () => {
    setModal(false);
    navigate("/storesearch");
  };

  //수정중이라면 기존 사진url받아서 보여주기?
  //imgFile이 스트링이면 url만있는거, 변경안하면 그대로 전달
  // imgFile에 file자체가 있으면 그걸로 저장
  //수정하면서 사진 지우면 스토리지에서도 삭제시켜야함
  const updateImg = async (isUpload: boolean, reviewID: string) => {
    const imageRef = ref(storage, `store/${store.id}/${reviewID}`);
    try {
      if (isUpload && imgFile?.file) {
        await uploadBytes(imageRef, imgFile.file);
      } else if (!isUpload) {
        await deleteObject(imageRef);
      }
    } catch (e) {
      throw new Error("error");
    }
  };

  const getUrl = async (reviewID: string) => {
    const imageRef = ref(storage, `store/${store.id}/${reviewID}`);
    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (e) {
      throw new Error("error");
    }
  };

  const createDoc = async (formData: ReviewForm) => {
    const createdDate = new Date().toLocaleDateString("en-US");
    const { rating, flavor, richness, text } = formData;
    const { x, y, id, phone, storeName, address } = store;
    const stations: string[] = await getStation(x, y);
    const stationList = [...new Set(stations)];
    const prevRating = existingReview ? existingReview.rating : null;
    const reviewID = existingReview
      ? existingReview.reviewID
      : `${id}_${Date.now()}`;
    const newDoc = {
      id: id,
      phone: phone,
      storeName: storeName,
      address: address,
      x: x,
      y: y,
      stationList: stationList,
    };

    if (imgFile?.file) {
      await updateImg(true, reviewID);
    } else if (!imgFile && existingReview) {
      await updateImg(false, reviewID);
    }
    const url = imgFile ? await getUrl(reviewID) : null;

    const review = {
      reviewID: reviewID,
      date: createdDate,
      user: {
        email: user?.email,
        displayName: user?.displayName,
        uid: user?.uid,
      },
      flavor: flavor,
      richness: richness,
      text: text,
      rating: rating,
      image: url,
      comments: null,
    };

    // docMutate({ newDoc, rating });
    reviewMutate({ prevRating, id, newDoc, reviewID, review });
    console.log("등록완료");
    sessionStorage.clear();
    navigate(`/store/${id}`, { replace: true });
  };

  const handleSubmit = (formData: ReviewForm) => {
    createDoc(formData);
  };

  return (
    <main className="pt-10 pb-20 ">
      <div className=" mx-auto text-center ">
        <ul className="steps scale-75">
          <li className="step step-primary  mr-3"></li>
          <li className="step step-primary before:scale-x-150 ml-3"></li>
        </ul>
        <FormBoard
          title="리뷰 작성하기"
          submitBtn={existingReview ? "리뷰 수정" : "리뷰 등록"}
          onSubmit={onSubmit(handleSubmit)}
        >
          <div className="flex justify-center items-center text-sm -mt-6">
            <div className="inline-block w-1/3 text-center font-semibold shrink-0 ml-5">
              {store.storeName}
            </div>
            <p className="w-2/3 indent-3 text-left">{store.address}</p>
          </div>
          <div className="flex justify-center items-center my-4 text-secondary-content text-sm font-semibold">
            <div className="inline-block  mr-2 ">평점 선택</div>
            <div className="rating flex items-center">
              {Array.from({ length: 6 }, (v, i) => (v = i)).map((rate) => (
                <input
                  key={rate}
                  type="radio"
                  className="mask mask-star-2 bg-accent first:hidden"
                  value={String(rate)}
                  defaultChecked={rate === 0 ? true : false}
                  {...register("rating", { required: true })}
                />
              ))}
              <span className="ml-2">{rate}</span>
            </div>
          </div>
          <div className="max-w-[500px] mx-auto">
            <div className="flex items-center">
              <span>
                <i className="ico-coffeeBean text-xl px-2"></i>
              </span>
              {Object.entries(flavorList).map(([value, description]) => (
                <label
                  key={value}
                  className="label cursor-pointer w-1/3 justify-start"
                >
                  <input
                    type="radio"
                    value={value}
                    className="radio radio-sm mr-2"
                    {...register("flavor", {
                      required: "옵션을 선택해주세요.",
                    })}
                  />
                  <span className="label-text">{description}</span>
                </label>
              ))}
            </div>
            <div className="">
              {errors?.flavor ? (
                <>
                  <div className="flex justify-end items-center text-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      className="inline w-3 h-3 mr-1"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                    </svg>

                    <p className="inline-block  text-right text-xs">
                      {errors.flavor.message}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex items-center">
              <span>
                <i className="ico-coffeeBean text-xl px-2"></i>
              </span>
              {Object.entries(richnessList).map(([value, description]) => (
                <label
                  key={value}
                  className="label cursor-pointer w-1/3 justify-start"
                >
                  <input
                    type="radio"
                    value={value}
                    className="radio radio-sm mr-2"
                    {...register("richness", {
                      required: "옵션을 선택해주세요.",
                    })}
                  />
                  <span className="label-text">{description}</span>
                </label>
              ))}
            </div>
            <div className="w-full">
              {errors?.richness ? (
                <div className="flex justify-end items-center text-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="inline w-3 h-3 mr-1"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                  </svg>

                  <p className="inline-block  text-right text-xs">
                    {errors.richness.message}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center text-sm mb-4">
            <textarea
              placeholder="리뷰를 입력해주세요 (10자 이상)"
              spellCheck={false}
              maxLength={150}
              required
              className="textarea textarea-bordered bg-[#fff] textarea-sm w-full max-w-lg mt-4"
              {...register("text", {
                required: true,
                minLength: {
                  value: 10,
                  message: "10글자 이상 입력해주세요.",
                },
              })}
            />
            <div className="w-full mt-2 max-w-lg">
              {errors?.text ? (
                <>
                  <div className="flex justify-end items-center text-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      className="inline w-3 h-3 mr-1"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                    </svg>

                    <p className="inline-block  text-right text-xs">
                      {errors.text.message}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="text-left indent-5 text-sm font-semibold mr-2 mb-2 ">
            사진을 첨부해주세요.{" "}
            <span className="text-xs font-normal">(선택 항목)</span>
          </div>
          <ImageUploader dispatch={setImgFile} img={imgFile} />
          <button
            role="button"
            onClick={() => reset()}
            className="text-sm font-semibold hover:bg-base-300 bg-base-200 p-2 mt-5 rounded-full"
          >
            다시 작성하기
          </button>
        </FormBoard>
      </div>
      <Modal
        toggle={modal}
        handleRedirect={handleRedirect}
        option={modalOption}
      />
    </main>
  );
};
export default CreateReview;
