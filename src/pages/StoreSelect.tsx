import { Link } from "react-router-dom";
import Board from "../components/Board";
import SearchBar from "../components/SearchBar";
import StoreList from "../components/StoreList";

const StoreSelect = () => {
  return (
    <main className="pt-10 pb-20 ">
      <div className=" mx-auto text-center">
        <ul className="steps scale-75">
          <li className="step step-primary  mr-3"></li>
          <li className="step  before:scale-x-150 ml-3"></li>
        </ul>
        <Board title="카페 선택하기">
          {/* <SearchBar  value={}
            dispatchValue={}
            handler={}/> */}
          <StoreList stores={[]} />
          <div className="text-[14px] font-bold flex items-center justify-center h-6 my-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="inline-block mr-2 shrink-0"
            >
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
              <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
            </svg>
            <p className="inline-block">
              찾으시는 카페가 없나요?{" "}
              <Link
                to={"/storesearch"}
                className="link hover:text-primary inline-block h-6"
              >
                여기에서
              </Link>{" "}
              카페 검색해보고 첫 리뷰를 남겨주세요!
            </p>
          </div>
        </Board>
        <div className="my-4">
          <button className="w-28 btn btn-primary bg-primary/50 hover:bg-primary/70 border-none">
            <Link
              to={"/review"}
              className="w-full h-full flex items-center justify-center"
            >
              다음단계
            </Link>
          </button>
          <button className="w-28 btn btn-active btn-ghost">
            <Link
              to={"/"}
              className="w-full h-full flex items-center justify-center"
            >
              취소
            </Link>
          </button>
        </div>
      </div>
    </main>
  );
};
export default StoreSelect;
