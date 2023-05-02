import cx from "clsx";

interface StoreProps {
  id: string;
  place_name: string;
  road_address_name: string;
}

interface Props {
  stores: StoreProps[];
}

const StoreList = (props: Props) => {
  const storeList = props.stores;
  return (
    <ul className="max-w-md py-3 mx-auto">
      {/* {storeList.length > 0 */}
      {/* ? storeList.map((store) => ( */}
      <li key={"01"} className="flex justify-start items-center  p-2">
        <input
          type="radio"
          name="radio-store"
          className="radio radio-primary"
          id={"01"}
        />
        <label htmlFor={"01"} className="p-1 w-full flex ">
          <div className="w-24 h-24 mr-2 border border-neutral-300 rounded-xl overflow-hidden shrink-0">
            <img
              src="http://via.placeholder.com/100/fff"
              alt="업체리뷰이미지"
            />
          </div>

          <div className="w-full flex flex-col    justify-start ml-2">
            <p className="mb-2 md:mt-2 text-left shrink-0 w-1/2 md:leading-loose">
              {"업체주소"}
            </p>

            <p className="md:text-sm truncate text-xs text-left">
              {"업체주소주소주소주소주소주소"}
            </p>

            <div className="flex w-[140px] justify-between ">
              <span className="inline-block mt-0.5 font-semibold text-secondary-content">
                4
              </span>
              <div className="relative inline-block ml-1 w-[84px] h-[18px]">
                <div className="absolute top-0 ">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="inline-block text-neutral-300"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                      </svg>
                    ))}
                </div>
                <div
                  className="absolute  overflow-hidden whitespace-nowrap"
                  style={{
                    width: `${4 * 16}px`,
                  }}
                >
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="inline-block text-accent"
                      >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                      </svg>
                    ))}
                </div>
              </div>
              <span className="inline-block mt-0.5">{"(10)"}</span>
            </div>
          </div>
        </label>
      </li>
      {/* ))
        : null} */}
    </ul>
  );
};

export default StoreList;
