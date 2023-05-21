import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { findStoreByName, findStoreByStation } from "../api/firebase";
import { DocumentData } from "firebase/firestore";
import StoreInfo from "./StoreInfo";
import { Link, useNavigate } from "react-router-dom";
import cx from "clsx";

const StorePageSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [noResult, setNoResult] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedList, setSearchedLIst] = useState<DocumentData[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchInput === "") {
      setResultModal(false);
    }
  }, [searchInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoResult(false);
    setSearchedLIst([]);
    getResult();
    setResultModal(true);
    setIsLoading(true);
  };

  const getResult = async () => {
    if (searchInput === "") {
      setResultModal(false);
      return;
    }
    const resultByName = await findStoreByName(searchInput);
    const resultByStation = await findStoreByStation(searchInput);
    const result = resultByName.concat(resultByStation);
    if (result.length > 0) {
      setNoResult(false);
      setSearchedLIst(result);
    } else {
      setNoResult(true);
    }
    setIsLoading(false);
  };

  //페이지 이동해서 보여주는걸로 바꾸자, 페이지네이션도 필요

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="text-xs mb-4 p-3 px-8 bg-[#fff] rounded-full font-semibold text-[#a08973] shadow-md shadow-base-200">
          <p>커피에 진심이신가요?</p>
          <p className="flex items-center h-6">
            <i className="ico-coffeeBean inline-block mt-0.5 mr-0.5"></i>
            <span className="inline-block">
              Java Time에서 커피리뷰를 공유해보세요!
            </span>
          </p>
        </div>
        <div className="relative">
          <SearchBar
            value={searchInput}
            dispatchValue={setSearchInput}
            handler={handleSubmit}
            placeHolder="지하철역 or 카페명으로 리뷰를 찾아보세요."
          />
          <ul
            className={cx(
              "absolute p-2 md:w-[500px] min-w-[400px] min-h-[140px] rounded-2xl shadow-md shadow-base-300 bg-base-200  mt-2",
              { ["hidden"]: !resultModal }
            )}
          >
            {isLoading ? (
              <button className="btn btn-ghost mt-10 bg-base-200 text-[#fff] btn-square loading"></button>
            ) : null}
            {noResult ? (
              <li className="h-[100px] flex items-center rounded-2xl">
                등록된 리뷰가 없습니다.
              </li>
            ) : (
              searchedList?.map((store) => (
                <li
                  key={store.id}
                  onClick={() => navigate(`/store/${store.id}`)}
                  className="cursor-pointer hover:bg-base-100 transition duration-300 ease-in-out rounded-2xl pt-1 pl-1"
                >
                  <StoreInfo info={store} map={false} />
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
};
export default StorePageSearch;
