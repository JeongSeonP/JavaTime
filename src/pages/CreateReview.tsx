import { useNavigate } from "react-router-dom";
import FormBoard from "../components/FormBoard";
import { useEffect, useState } from "react";
import cx from "clsx";
import { useForm } from "react-hook-form";
import ImageUploader from "../components/ImageUploader";
import Modal from "../components/Modal";
import { getStation } from "../kakaoAPI";
import { addStore, auth, setDocReview, setDocStore } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

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

const CreateReview = () => {
  const [modal, setModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
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
  const rate = watch("rating");
  const flavorList = [
    ["sour", "산미가 있어요"],
    ["nutty", "고소해요"],
  ];
  const richnessList = [
    ["rich", "커피맛이 진해요"],
    ["bland", "커피맛이 싱거워요"],
    ["bitter", "커피맛이 써요"],
  ];
  const modalOption = {
    h3: "리뷰 남기실 카페를 먼저 선택해주세요.",
    p: "아래 버튼을 누르시면 카페 선택 페이지로 이동합니다.",
    button: "카페 선택하러 가기",
  };

  useEffect(() => {
    const store = sessionStorage.getItem("selectedStore");
    if (store) {
      setStore(JSON.parse(store));
    } else if (store === null) {
      setModal(true);
    }
  }, []);

  const handleRedirect = () => {
    setModal(false);
    navigate("/storeselect");
  };

  console.log(new Date().toLocaleString("en-US").split(",")[0]);

  //지하철역 구한담에 이미지파일 처리, firestore올릴 데이터형식 만들고 setDoc하기
  const createDoc = async (formData: ReviewForm) => {
    const createdDate = new Date().toLocaleString("en-US").split(",")[0];
    const { rating, flavor, richness, text } = formData;
    const { x, y, id, phone, storeName, address } = store;
    const stations: string[] = await getStation(x, y);
    const stationList = [...new Set(stations)];
    const reviewID = `${id}_${Date.now()}`;
    const newDoc = {
      id: id,
      phone: phone,
      storeName: storeName,
      address: address,
      stationList: stationList,
    };
    const review = {
      [reviewID]: {
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
      },
    };
    await setDocStore(newDoc);
    await setDocReview(id, reviewID, review);
    console.log("등록완료");
    navigate(`/store/${id}`);
    //이후에 해당 업체별페이지로 이동
  };

  const handleSubmit = (formData: ReviewForm) => {
    console.log(isSubmitSuccessful);
    console.log(formData);
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
          submitBtn="리뷰 등록"
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
                <svg
                  className=" w-9 h-9 inline-block px-2 "
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 124.000000 120.000000"
                  preserveAspectRatio="xMidYMid meet"
                  fill="currentColor"
                >
                  <g
                    transform="translate(0.000000,120.000000) scale(0.100000,-0.100000)"
                    stroke="none"
                  >
                    <path
                      d="M725 1186 c-59 -12 -176 -61 -225 -96 -14 -9 -37 -20 -51 -23 -14 -4
-43 -20 -65 -37 -21 -17 -48 -37 -59 -45 -52 -38 -165 -137 -165 -144 0 -4
-22 -44 -48 -88 -51 -84 -62 -109 -82 -183 -7 -25 -16 -55 -21 -68 -11 -29
-12 -199 -1 -206 5 -3 15 -31 22 -63 16 -71 26 -91 58 -121 26 -25 25 -25 150
-6 36 5 51 15 97 68 74 84 175 218 175 234 0 6 4 12 9 12 5 0 12 13 16 28 3
16 19 43 35 61 16 17 49 62 73 99 49 75 93 122 113 122 8 0 14 4 14 9 0 9 134
91 149 91 11 0 71 33 134 74 98 63 122 128 67 181 -16 16 -30 33 -30 38 0 6
-11 25 -26 44 l-25 33 -127 -1 c-70 -1 -154 -6 -187 -13z"
                    />
                    <path
                      d="M1155 936 c-14 -14 -25 -30 -25 -36 0 -11 -53 -91 -77 -117 -6 -7
-42 -29 -80 -49 -77 -40 -151 -89 -204 -137 -20 -18 -49 -42 -64 -55 -40 -33
-115 -133 -115 -153 0 -18 -175 -198 -257 -267 -35 -28 -43 -41 -43 -68 0 -18
5 -36 11 -40 19 -11 220 -7 232 5 6 6 21 11 34 11 12 0 51 9 85 19 35 11 82
24 105 30 113 30 360 303 408 451 10 30 29 76 42 102 19 38 24 66 27 152 5
132 -2 170 -32 174 -13 2 -32 -7 -47 -22z"
                    />
                  </g>
                </svg>
              </span>
              {flavorList.map(([value, description]) => (
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
                <svg
                  className=" w-9 h-9 inline-block px-2 inline-block px-2 "
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="124.000000pt"
                  height="120.000000pt"
                  viewBox="0 0 124.000000 120.000000"
                  preserveAspectRatio="xMidYMid meet"
                  fill="currentColor"
                >
                  <g
                    transform="translate(0.000000,120.000000) scale(0.100000,-0.100000)"
                    stroke="none"
                  >
                    <path
                      d="M725 1186 c-59 -12 -176 -61 -225 -96 -14 -9 -37 -20 -51 -23 -14 -4
-43 -20 -65 -37 -21 -17 -48 -37 -59 -45 -52 -38 -165 -137 -165 -144 0 -4
-22 -44 -48 -88 -51 -84 -62 -109 -82 -183 -7 -25 -16 -55 -21 -68 -11 -29
-12 -199 -1 -206 5 -3 15 -31 22 -63 16 -71 26 -91 58 -121 26 -25 25 -25 150
-6 36 5 51 15 97 68 74 84 175 218 175 234 0 6 4 12 9 12 5 0 12 13 16 28 3
16 19 43 35 61 16 17 49 62 73 99 49 75 93 122 113 122 8 0 14 4 14 9 0 9 134
91 149 91 11 0 71 33 134 74 98 63 122 128 67 181 -16 16 -30 33 -30 38 0 6
-11 25 -26 44 l-25 33 -127 -1 c-70 -1 -154 -6 -187 -13z"
                    />
                    <path
                      d="M1155 936 c-14 -14 -25 -30 -25 -36 0 -11 -53 -91 -77 -117 -6 -7
-42 -29 -80 -49 -77 -40 -151 -89 -204 -137 -20 -18 -49 -42 -64 -55 -40 -33
-115 -133 -115 -153 0 -18 -175 -198 -257 -267 -35 -28 -43 -41 -43 -68 0 -18
5 -36 11 -40 19 -11 220 -7 232 5 6 6 21 11 34 11 12 0 51 9 85 19 35 11 82
24 105 30 113 30 360 303 408 451 10 30 29 76 42 102 19 38 24 66 27 152 5
132 -2 170 -32 174 -13 2 -32 -7 -47 -22z"
                    />
                  </g>
                </svg>
              </span>
              {richnessList.map(([value, description]) => (
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
          <ImageUploader />
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
