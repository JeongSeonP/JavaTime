import cx from "clsx";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Dispatch, SetStateAction } from "react";

interface StoreProps {
  id: string;
  place_name: string;
  road_address_name: string;
}

interface Props {
  storeList: StoreProps[];
  dispatchID: Dispatch<SetStateAction<string>>;
}

const SearchedStores = ({ storeList, dispatchID }: Props) => {
  return (
    <ul className="max-w-md py-3 mx-auto">
      {storeList.length > 0
        ? storeList.map((store) => (
            <li key={store.id} className="flex justify-start items-center  p-2">
              <input
                type="radio"
                name="radio-store"
                className="radio radio-primary"
                id={store.id}
                onChange={(e) => dispatchID(e.target.id)}
              />
              <label
                htmlFor={store.id}
                className="p-1 w-full flex md:justify-between"
              >
                <div className="w-full  flex flex-col sm:flex-row   justify-start ml-2 truncate">
                  <p className="mb-2 md:mt-2 text-left shrink-0 w-1/2 md:leading-loose">
                    {store.place_name}
                  </p>
                  <div className="max-w-[200px] flex flex-col md:justify-center">
                    <p className="md:text-sm truncate text-xs text-left">
                      {store.road_address_name}
                    </p>

                    <p className="text-left text-xs my-1 hover:underline">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`http://place.map.kakao.com/${store.id}`}
                      >
                        업체 상세정보 보러가기
                      </a>
                    </p>
                  </div>
                </div>
              </label>
            </li>
          ))
        : null}
    </ul>
  );
};

export default SearchedStores;
