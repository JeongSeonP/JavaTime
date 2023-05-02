import { Link } from "react-router-dom";
import Board from "../components/Board";
import FormBoard from "../components/FormBoard";
import { useState } from "react";

const CreateProfile = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <main className="pt-10 pb-20 ">
      <div className=" mx-auto text-center ">
        <FormBoard
          title="프로필 작성하기"
          submitBtn="프로필 등록"
          onSubmit={() => {
            console.log("ha");
          }}
        >
          <div className="flex justify-center items-center">
            <label
              htmlFor="nickname"
              className="block w-24 text-left font-semibold text-sm"
            >
              닉네임{" "}
            </label>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type="text"
              id="nickname"
              name="nickname"
              placeholder=""
              className="placeholder:text-sm input w-full max-w-xs input-bordered input-primary rounded-lg "
            />
          </div>
          <div className="max-w-[500px] mx-auto mt-4 text-sm">
            <div className="text-left  font-semibold mr-2 my-6">
              자신의 커피취향을 선택해보세요.
            </div>
            <div className="flex items-center">
              <div className="inline-block w-20 font-semibold text-left">
                원두
              </div>
              <label className="label cursor-pointer w-1/3 justify-start">
                <input
                  type="radio"
                  name="radio-1"
                  className="radio radio-sm mr-2"
                />
                <span className="label-text">산미가 있는 원두</span>
              </label>
              <label className="label cursor-pointer w-1/3 justify-start">
                <input
                  type="radio"
                  name="radio-1"
                  className="radio radio-sm mr-2"
                />
                <span className="label-text">고소한 원두</span>
              </label>
            </div>
            <div className="flex items-center">
              <div className="inline-block w-20 font-semibold text-left">
                커피종류
              </div>
              <label className="label cursor-pointer w-1/3 justify-start">
                <input
                  type="radio"
                  name="radio-2"
                  className="radio radio-sm mr-2"
                />
                <span className="label-text">아메리카노</span>
              </label>
              <label className="label cursor-pointer w-1/3 justify-start">
                <input
                  type="radio"
                  name="radio-2"
                  className="radio radio-sm mr-2"
                />
                <span className="label-text">카페라떼</span>
              </label>
              <label className="label cursor-pointer w-1/3 justify-start">
                <input
                  type="radio"
                  name="radio-2"
                  className="radio radio-sm mr-2"
                />
                <span className="label-text">드립커피</span>
              </label>
            </div>
          </div>
        </FormBoard>
      </div>
    </main>
  );
};
export default CreateProfile;
