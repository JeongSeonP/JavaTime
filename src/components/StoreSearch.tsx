import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SearchedStores from "./SearchedStores";
import { getSearchedStoreInfo } from "../api/kakaoAPI";
import cx from "clsx";
import SearchInput from "./SearchInput";

export interface StoreProps {
  id: string;
  place_name: string;
  phone: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface Props {
  dispatch: Dispatch<
    SetStateAction<{
      id: string;
      phone: string;
      storeName: string;
      address: string;
      x: string;
      y: string;
    }>
  >;
}

const StoreSearch = ({ dispatch }: Props) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchedList, setSearchedLIst] = useState<StoreProps[]>([]);
  const [page, setPage] = useState("");
  const [lastPage, setLastPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [resultModal, setResultModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultModal(true);
    setSearchedLIst([]);
    setPage("1");
    getPage();
  };

  const handlePage = async () => {
    setIsLoading(true);
    setPage((page) => String(Number(page) + 1));
  };

  const getSelectedStore = (selectedID: string) => {
    const store: StoreProps | undefined = searchedList.find(
      (store) => store.id === selectedID
    );
    if (store) {
      const selectedStore = {
        id: store.id,
        phone: store.phone,
        storeName: store.place_name,
        address: store.road_address_name,
        x: store.x,
        y: store.y,
      };
      dispatch(selectedStore);
      setResultModal(false);
      setSearchInput("");
    }
  };

  const getPage = async () => {
    if (searchInput === "" || page === "0") return;
    const [storeInfos, isEnd] = await getSearchedStoreInfo(searchInput, page);

    if (storeInfos.length === 0) {
      setNoResult(true);
      setLastPage(true);
      setPage("0");
      setSearchedLIst([]);
      return;
    } else {
      setLastPage(false);
      setNoResult(false);
    }

    if (isEnd) {
      setLastPage(isEnd);
    }
    if (page !== "1") {
      const newStoreList = searchedList.concat(storeInfos);
      setSearchedLIst(newStoreList);
    } else {
      setSearchedLIst(storeInfos);
    }
  };

  useEffect(() => {
    if (searchInput === "") {
      setNoResult(false);
      setResultModal(false);
    }
  }, [searchInput]);

  useEffect(() => {
    getPage();
    setIsLoading(false);
  }, [page]);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="relative w-[350px]">
          <form
            onSubmit={handleSubmit}
            className="input-group flex justify-center border border-base-300 relative w-full rounded-full shadow-sm"
          >
            <SearchInput
              value={searchInput}
              dispatchValue={setSearchInput}
              placeHolder="리뷰 작성할 카페이름을 검색해보세요"
            />
          </form>
        </div>
      </div>
      {resultModal ? (
        <div className="absolute bg-base-200 rounded-xl overflow-hidden shadow-md">
          {noResult ? (
            <div className="w-[350px] p-6">검색결과가 없습니다.</div>
          ) : (
            <SearchedStores
              storeList={searchedList}
              dispatchID={getSelectedStore}
            />
          )}
          {lastPage ? null : (
            <button
              onClick={handlePage}
              className={cx(
                "btn btn-sm btn-ghost w-3/4 bg-base-100 hover:bg-base-300 mb-2",
                { ["loading"]: isLoading }
              )}
            >
              더보기
            </button>
          )}
        </div>
      ) : null}
    </>
  );
};
export default StoreSearch;
