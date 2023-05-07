import { useNavigate } from "react-router-dom";
import FormBoard from "../components/FormBoard";
import { useEffect, useState } from "react";
import cx from "clsx";
import { useForm } from "react-hook-form";
import ImageUploader from "../components/ImageUploader";
import Modal from "../components/Modal";
import { getStation } from "../kakaoAPI";

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
  const [inputValue, setInputValue] = useState("");
  const [modal, setModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const [store, setStore] = useState({
    id: "",
    storeName: "",
    address: "",
    x: "",
    y: "",
  });
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit: onSubmit,
  } = useForm<ReviewForm>({
    mode: "onSubmit",
    defaultValues: {
      rating: "5",
      flavor: "",
      richness: "",
      text: "",
    },
  });
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

  //지하철역 구한담에 이미지파일 처리, firestore올릴 데이터형식 만들고 setDoc하기
  const createDoc = async () => {
    const { x, y } = store;
    const stationList = await getStation(x, y);
    console.log(stationList);
  };

  const handleSubmit = (formData: ReviewForm) => {
    console.log(isSubmitSuccessful);
    console.log(formData);
    createDoc();
  };

  //다시작성하기 기능 추가(리셋)

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
          <div className="flex justify-center items-center my-4">
            <div className="inline-block text-secondary-content text-sm font-semibold mr-2 ">
              평점 선택
            </div>
            <div className="rating flex items-center">
              {Array.from({ length: 5 }, (v, i) => (v = String(i + 1))).map(
                (rate) => (
                  <input
                    key={rate}
                    type="radio"
                    className="mask mask-star-2 bg-accent"
                    value={rate}
                    {...register("rating", { required: true })}
                  />
                )
              )}
            </div>
          </div>
          <div className="max-w-[500px] mx-auto">
            <div className="text-left text-sm font-semibold mr-2 mb-2 ">
              선택해주세요.
            </div>
            <div className="flex items-center">
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
              <div className="">
                {errors?.flavor ? (
                  <p className="text-error text-right text-xs">
                    {errors.flavor.message}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex ">
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
          </div>
          <div className="w-full">
            {errors?.richness ? (
              <p className="text-error text-right text-xs">
                {errors.richness.message}
              </p>
            ) : null}
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
            <div className="w-full mt-2">
              {errors?.text ? (
                <p className="text-error text-right text-xs">
                  {errors.text.message}
                </p>
              ) : null}
            </div>
          </div>
          <ImageUploader />
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
