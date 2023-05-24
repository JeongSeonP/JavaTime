import { useEffect, useRef, useState } from "react";
import { findStoreByName, findStoreByStation } from "../api/firebase";
import { DocumentData } from "firebase/firestore";
import StoreInfo from "../components/StoreInfo";
import { Link, Outlet, useNavigate } from "react-router-dom";
import cx from "clsx";
import { useRecoilState } from "recoil";
import { searchedInput } from "../SearchInputAtom";
import SearchReview from "../components/InputDispatch";
import SearchInput from "../components/SearchInput";

//다른데 위치한 검색창에서 검색어 입력하면
//여기에 서치인풋 이니셜값으로
// 리코일으로..? 서치바는 단순하게 값만 리코일에 전달하는역할로바꿔서?
const StorePageSearch = () => {
  // const [searchInput, setSearchInput] = useState("");
  const [noResult, setNoResult] = useState(false);
  // const [resultModal, setResultModal] = useState(false);
  const [count, setCount] = useState(0);
  const [searchedList, setSearchedLIst] = useState<DocumentData[] | null>(null);
  const [page, setPage] = useState<DocumentData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useRecoilState(searchedInput);

  useEffect(() => {
    if (searchInput !== "") {
      setNoResult(false);
      setSearchedLIst([]);
      getResult();
      setIsLoading(true);
    }
    return () => setSearchInput("");
  }, []);

  useEffect(() => {
    if (searchInput === "") {
      setNoResult(false);
    }
  }, [searchInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoResult(false);
    setSearchedLIst([]);
    getResult();
    setIsLoading(true);
  };

  const getResult = async () => {
    if (searchInput === "") {
      return;
    }
    const resultByName = await findStoreByName(searchInput);
    const resultByStation = await findStoreByStation(searchInput);
    const result = resultByName.concat(resultByStation);
    const perPage = 5;
    if (result.length > 0) {
      setNoResult(false);
      const pages = [];
      for (let i = 0; i < result.length; i += perPage) {
        pages.push(result.slice(i, i + perPage));
      }
      setSearchedLIst(pages);
      setCount(pages.length - 1);
      setPage(pages[0]);
    } else {
      setNoResult(true);
    }
    setIsLoading(false);
  };

  const handlePage = () => {
    setCount((pre) => pre + 1);
    if (page && searchedList) {
      if (count >= searchedList?.length - 1) {
        setCount(0);
      }
      const nextPage = page?.concat(searchedList[count]);
      setPage(nextPage);
    }
  };

  return (
    <main className="pt-10 pb-20 ">
      <div className=" mx-auto text-center">
        <div className="flex flex-col justify-center items-center">
          <div className="relative w-[350px]">
            <form
              onSubmit={handleSubmit}
              className="input-group flex justify-center border border-base-300 relative w-full rounded-full shadow-sm"
            >
              <SearchInput
                value={searchInput}
                dispatchValue={setSearchInput}
                placeHolder="지하철역 or 카페명으로 리뷰를 찾아보세요."
              />
            </form>
          </div>
          <ul className=" flex flex-col items-center md:w-full max-w-xl w-[350px] rounded-2xl mt-2 p-2">
            {isLoading ? (
              <button className="btn btn-ghost mt-10 bg-base-200 text-[#fff] btn-square loading"></button>
            ) : null}
            {noResult ? (
              <li className="h-[100px] w-full flex items-center rounded-2xl">
                등록된 리뷰가 없습니다.
              </li>
            ) : (
              page?.map((store) => (
                <li
                  key={store.id}
                  onClick={() => navigate(`/store/${store.id}`)}
                  className="cursor-pointer hover:bg-[#fff] transition duration-300 ease-in-out rounded-2xl pt-1 pl-1"
                >
                  <StoreInfo storeDoc={store} map={false} />
                </li>
              ))
            )}
          </ul>
          {count > 0 ? (
            <button
              onClick={handlePage}
              className="btn btn-ghost w-3/4 sm:w-1/2 bg-base-200 hover:bg-base-300"
            >
              더보기
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
};
export default StorePageSearch;
