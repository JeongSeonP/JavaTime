import { useNavigate } from "react-router-dom";
import Board from "../components/Board";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import SearchedStores from "../components/SearchedStores";
import { getSearchedStoreInfo } from "../kakaoAPI";
import Modal from "../components/Modal";
import cx from "clsx";

export interface StoreProps {
  id: string;
  place_name: string;
  phone: string;
  road_address_name: string;
  x: string;
  y: string;
}

const StoreSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchedList, setSearchedLIst] = useState<StoreProps[]>([]);
  const [page, setPage] = useState("");
  const [lastPage, setLastPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [isSelected, setisSelected] = useState(false);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const modalOption = {
    h3: "선택된 카페가 없습니다. 카페를 선택해주세요.",
    p: "카페선택을 계속하시려면 확인버튼을 눌러주세요.",
    button: "확인",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      sessionStorage.setItem("selectedStore", JSON.stringify(selectedStore));
      setisSelected(true);
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

  const handleNextStep = () => {
    if (isSelected) {
      navigate("/review");
      setisSelected(false);
    } else {
      setModal(true);
    }
  };

  const handleRedirect = () => {
    setModal(false);
  };

  useEffect(() => {
    getPage();
    setIsLoading(false);
  }, [page]);

  return (
    <main className="pt-10 pb-20 ">
      <div className=" mx-auto text-center">
        <ul className="steps scale-75">
          <li className="step step-primary  mr-3"></li>
          <li className="step   before:scale-x-150 ml-3"></li>
        </ul>
        <Board title="카페 찾아보기">
          <SearchBar
            value={searchInput}
            dispatchValue={setSearchInput}
            handler={handleSubmit}
            placeHolder="카페이름을 검색해보세요"
          />
          {noResult ? (
            <div className="mt-6">검색결과가 없습니다.</div>
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
                "btn btn-ghost w-3/4 bg-base-200 hover:bg-base-300",
                { ["loading"]: isLoading }
              )}
            >
              더보기
            </button>
          )}
        </Board>
        <div className="my-4">
          <button
            onClick={handleNextStep}
            className="w-28 btn btn-primary bg-primary/50 hover:bg-primary/70 border-none"
          >
            다음단계
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-28 btn btn-active btn-ghost"
          >
            취소
          </button>
        </div>
      </div>
      <Modal
        toggle={modal}
        handleRedirect={handleRedirect}
        option={modalOption}
      />
    </main>
  );
};
export default StoreSearch;
