import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { findStoreByName, findStoreByStation } from "../firebase";
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

  return (
    <>
      <div>
        <SearchBar
          value={searchInput}
          dispatchValue={setSearchInput}
          handler={handleSubmit}
          placeHolder="지하철역 or 카페명을 검색해보세요."
        />
        <ul
          className={cx(
            "p-2 absolute left-2/4 -translate-x-2/4 md:w-[500px] min-w-[400px] min-h-[140px] rounded-2xl shadow-md bg-base-200  mt-2",
            { ["hidden"]: !resultModal }
          )}
        >
          <button
            className={cx(
              "btn btn-ghost mt-10 bg-base-200 text-primary btn-square loading",
              { ["hidden"]: !isLoading }
            )}
          ></button>
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
    </>
  );
};
export default StorePageSearch;
