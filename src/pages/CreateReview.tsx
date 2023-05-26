import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUploader, { Imagefile } from "../components/ImageUploader";
import { getStation } from "../api/kakaoAPI";
import { auth, getUrl, setDocReview, storage } from "../api/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useMutation, useQueryClient } from "react-query";
import { flavorList, richnessList } from "../components/SelectOptions";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import StoreSearch from "../components/StoreSearch";
import Board from "../components/Board";
import SuccessModal from "../components/SuccessModal";
import { FiAlertCircle } from "react-icons/fi";

export interface ReviewForm {
  rating: string;
  flavor: string;
  richness: string;
  text: string;
}

interface RevisionOption {
  reviewID: string;
  rating: string;
  flavor: "sour" | "nutty";
  richness: "rich" | "bland" | "bitter";
  text: string;
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
    formState: { errors },
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
      queryClient.invalidateQueries(["storeInfo"]);
      queryClient.invalidateQueries(["reviewInfo", store.id]);
      setTimeout(() => {
        navigate(`/store/${store.id}`, { replace: true });
      }, 1000);
    },
  });
  const rate = watch("rating");

  useEffect(() => {
    const store = sessionStorage.getItem("selectedStore");
    if (store) {
      setStore(JSON.parse(store));
    }
    const isRevision = sessionStorage.getItem("revisionOption");
    if (isRevision) {
      setExistingReview(JSON.parse(isRevision));
    }
    return () => {
      sessionStorage.clear();
      setModal(false);
    };
  }, []);

  useEffect(() => {
    if (existingReview) {
      reset({
        rating: existingReview.rating,
        flavor: existingReview.flavor,
        richness: existingReview.richness,
        text: existingReview.text,
      });
    }

    if (existingReview?.img) {
      setImgFile({
        file: null,
        thumnail: existingReview.img,
        name: "prevImg",
      });
    }
  }, [existingReview]);

  const updateImg = async (isUpload: boolean, reviewID: string) => {
    const imageRef = ref(storage, `store/${store.id}/${reviewID}`);
    try {
      if (isUpload) {
        if (imgFile?.file) {
          await uploadBytes(imageRef, imgFile.file);
        }
      } else {
        await deleteObject(imageRef);
      }
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
    const isRevised = existingReview ? true : false;
    const reviewID = existingReview
      ? existingReview.reviewID
      : `${id}_${Date.now()}`;

    if (imgFile) {
      await updateImg(true, reviewID);
    } else if (!imgFile && existingReview?.img) {
      await updateImg(false, reviewID);
    }
    const url = imgFile ? await getUrl(`store/${store.id}/${reviewID}`) : null;

    const newDoc = {
      id: id,
      phone: phone,
      storeName: storeName,
      address: address,
      x: x,
      y: y,
      stationList: stationList,
    };

    const review = {
      reviewID: reviewID,
      date: createdDate,
      user: {
        email: user?.email,
        displayName: user?.displayName,
        uid: user?.uid,
        photo: user?.photoURL,
      },
      flavor: flavor,
      richness: richness,
      text: text,
      rating: rating,
      image: url,
      comments: null,
      isRevised: isRevised,
    };
    reviewMutate({ prevRating, id, newDoc, reviewID, review });
    setModal(true);
  };

  const handleSubmit = (formData: ReviewForm) => {
    createDoc(formData);
  };

  return (
    <main className="pt-10 pb-20 ">
      <div className=" mx-auto text-center ">
        <Board title="리뷰 작성하기">
          <div className="">
            <div className="mx-auto mt-0 -translate-y-8 z-[999] relative w-[350px]">
              <StoreSearch dispatch={setStore} />
            </div>
          </div>
          <form onSubmit={onSubmit(handleSubmit)}>
            <div className="flex justify-center items-center text-sm ">
              <div className="inline-block w-1/3 text-center text-primary-dark-color font-semibold shrink-0 ml-5">
                {store.storeName}
              </div>
              <p className="w-2/3 indent-3 text-left">{store.address}</p>
            </div>
            <div className="flex justify-center items-center my-4 text-secondary-content text-sm font-semibold">
              <div className="inline-block  mr-2 ">평점 선택</div>
              <div className="rating flex items-center">
                {Array.from({ length: 6 }, (v, i) => (v = String(i))).map(
                  (rate) => (
                    <input
                      key={rate}
                      type="radio"
                      className="mask mask-star-2 bg-accent first:hidden"
                      value={String(rate)}
                      {...register("rating", { required: true })}
                    />
                  )
                )}
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
                    <span className="label-text text-xs">{description}</span>
                  </label>
                ))}
              </div>
              <div className="">
                {errors?.flavor ? (
                  <>
                    <div className="flex justify-end items-center text-error">
                      <FiAlertCircle className="mr-1" />

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
                    <span className="label-text text-xs">{description}</span>
                  </label>
                ))}
              </div>
              <div className="w-full">
                {errors?.richness ? (
                  <div className="flex justify-end items-center text-error">
                    <FiAlertCircle className="mr-1" />
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
              <div className="w-full h-4 max-w-lg">
                {errors?.text?.message ? (
                  <div className="flex justify-end pt-1 items-center text-error">
                    <FiAlertCircle className="mr-1" />
                    <p className="inline-block  text-right text-xs">
                      {errors.text.message}
                    </p>
                  </div>
                ) : (
                  <div className="h-4 pt-1"></div>
                )}
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
            <button className="btn btn-wide rounded-full shadow-md no-animation my-8 block mx-auto">
              {existingReview ? "리뷰 수정" : "리뷰 등록"}
            </button>
          </form>
        </Board>
      </div>
      {modal ? <SuccessModal loading={isLoading} /> : null}
    </main>
  );
};
export default CreateReview;
