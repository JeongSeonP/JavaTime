import { useSetRecoilState } from "recoil";
import { selectedStore } from "../StoreAtom";

interface StoreProps {
  id: string;
  place_name: string;
  road_address_name: string;
  phone: string;
}

interface Props {
  storeList: StoreProps[];
  dispatchID: (selectedID: string) => void;
}

//hover시 li 바탕색 바뀌게 하기
const SearchedStores = ({ storeList, dispatchID }: Props) => {
  return (
    <ul className="max-w-lg py-3 mx-auto">
      {storeList.length > 0
        ? storeList.map((store) => (
            <li
              key={store.id}
              className="flex justify-start items-center  p-2 hover:bg-[#fff] rounded-full"
            >
              <input
                type="radio"
                name="radio-store"
                className="radio radio-primary"
                id={store.id}
                required
                onChange={(e) => dispatchID(e.target.id)}
              />
              <label
                htmlFor={store.id}
                className="p-1 w-full flex md:justify-between"
              >
                <div className="w-full  flex items-center justify-between ml-2 truncate">
                  <p className="text-left text-sm font-semibold w-1/3 md:leading-loose whitespace-normal">
                    {store.place_name}
                  </p>
                  <div className="w-[40%] flex flex-col md:justify-center">
                    <p className="md:text-sm truncate text-xs text-left">
                      {store.road_address_name}
                    </p>
                    <p className="md:text-sm truncate text-xs text-left">
                      {store.phone}
                    </p>
                  </div>
                  <p className="text-left text-xs my-1 hover:bg-base-300 bg-base-200 p-1 rounded-full">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`http://place.map.kakao.com/${store.id}`}
                    >
                      업체 상세정보
                    </a>
                  </p>
                </div>
              </label>
            </li>
          ))
        : null}
    </ul>
  );
};

export default SearchedStores;
