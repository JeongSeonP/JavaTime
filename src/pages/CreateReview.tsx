import { Link } from "react-router-dom";
import Board from "../components/Board";
import FormBoard from "../components/FormBoard";
import { useState } from "react";
import { useRecoilValue } from "recoil";

const CreateReview = () => {
  const [inputValue, setInputValue] = useState("");

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
          onSubmit={() => {
            console.log("ha");
          }}
        >
          <div className="flex justify-center items-center text-sm">
            <div className="inline-block w-20 text-left font-semibold ">
              카페이름{" "}
            </div>
            <p>서울 마포구 월드컵로3길 14 마포한강푸르지오2차 230호</p>
          </div>
          <div className="flex justify-center items-center my-4">
            <div className="inline-block text-secondary-content text-sm font-semibold mr-2 ">
              평점
            </div>
            <div className="rating inline-block ">
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-accent"
                defaultChecked
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-accent"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-accent"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-accent"
              />
              <input
                type="radio"
                name="rating-2"
                className="mask mask-star-2 bg-accent"
              />
            </div>
          </div>
          <div className="max-w-[500px] mx-auto">
            <div className="text-left text-sm font-semibold mr-2 mb-2 ">
              자유롭게 선택해주세요.
            </div>
            <div className="flex ">
              <label className="label cursor-pointer w-1/3 justify-start">
                <input
                  type="radio"
                  name="radio-1"
                  className="radio radio-sm mr-2"
                />
                <span className="label-text">산미가 있어요</span>
              </label>
              <label className="label cursor-pointer w-1/3 justify-start">
                <input
                  type="radio"
                  name="radio-1"
                  className="radio radio-sm mr-2"
                />
                <span className="label-text">고소해요</span>
              </label>
            </div>
            <div className="flex ">
              <label className="label cursor-pointer w-1/3 justify-start">
                <input
                  type="radio"
                  name="radio-2"
                  className="radio radio-sm mr-2"
                />
                <span className="label-text">커피맛이 진해요</span>
              </label>
              <label className="label cursor-pointer w-1/3 justify-start">
                <input
                  type="radio"
                  name="radio-2"
                  className="radio radio-sm mr-2"
                />
                <span className="label-text">커피맛이 싱거워요</span>
              </label>
              <label className="label cursor-pointer w-1/3 justify-start">
                <input
                  type="radio"
                  name="radio-2"
                  className="radio radio-sm mr-2"
                />
                <span className="label-text">커피맛이 써요</span>
              </label>
            </div>
          </div>
          <div className="flex justify-center items-center text-sm">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="리뷰를 입력해주세요"
              maxLength={150}
              className="textarea textarea-bordered bg-[#fff] textarea-sm w-full max-w-lg mt-4"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered file-input-sm bg-[#fff]   max-w-xs mt-4 inline-block"
          />
        </FormBoard>
        {/* <div className="my-4">
          <button className="w-28 btn btn-primary bg-primary/50 hover:bg-primary/70 border-none">
            리뷰등록
          </button>
          <button className="w-28 btn btn-active btn-ghost">
            <Link to={"/"}>취소</Link>
          </button>
        </div> */}
      </div>
    </main>
  );
};
export default CreateReview;
