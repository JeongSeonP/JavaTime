import { Link } from "react-router-dom";
import Board from "../components/Board";
import SearchBar from "../components/SearchBar";
import StoreList from "../components/StoreList";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchedStores from "../components/SearchedStores";

interface StoreProps {
  id: string;
  place_name: string;
  road_address_name: string;
}

const StoreSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchedList, setSearchedLIst] = useState<StoreProps[]>([]);
  const [selectedID, setSelectedID] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const getSearchedStoreInfo = async (storeName: string) => {
      const { data } = await axios.get(
        `https://dapi.kakao.com/v2/local/search/keyword.json?category_group_code=CE7&query=${storeName}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
          },
        }
      );

      const placeInfo = data.documents;
      setSearchedLIst(placeInfo);
    };
    getSearchedStoreInfo(searchInput);
  };

  useEffect(() => {
    const [selectedStore] = searchedList.filter(
      (store) => store.id === selectedID
    );
    console.log(selectedStore);
    //이후에 그중에서 선택된 업체에 대해 x,y좌표 뽑아서 getStation호출해야함
  }, [selectedID]);

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
          />
          <SearchedStores storeList={searchedList} dispatchID={setSelectedID} />
        </Board>
        <div className="my-4">
          <button className="w-28 btn btn-primary bg-primary/50 hover:bg-primary/70 border-none">
            <Link to={"/review"}>다음단계</Link>
          </button>
          <button className="w-28 btn btn-active btn-ghost">
            <Link to={"/"}>취소</Link>
          </button>
        </div>
      </div>
    </main>
  );
};
export default StoreSearch;
