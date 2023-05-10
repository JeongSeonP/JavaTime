import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import KakaoMap from "./KakaoMap";

interface ReviewInfo {
  reviewLength: number;
  averageRate: string;
}
interface Props {
  info: DocumentData;
  reviewInfo: ReviewInfo;
}

const StoreInfo = ({ info, reviewInfo }: Props) => {
  const [mapOption, setMapOption] = useState({
    x: 0,
    y: 0,
    name: "",
    id: "",
  });
  const starWidth = 16;

  useEffect(() => {
    const { id, storeName, x, y } = info;
    const option = {
      x: Number(x),
      y: Number(y),
      name: storeName,
      id: id,
    };
    setMapOption(option);
  }, [info]);

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-xl">
        <div className="flex items-center justify-center mb-2">
          <div className="w-[150px] h-[150px] mr-2 border border-neutral-300 rounded-xl overflow-hidden shrink-0">
            <img
              src="https://via.placeholder.com/150/fff"
              alt="업체리뷰이미지"
            />
          </div>

          <div className="flex flex-col justify-center ml-2 min-w-[200px]">
            <p className="mb-2 md:mt-2 text-left shrink-0  md:leading-loose">
              {info.storeName}
            </p>

            <p className="md:text-sm truncate text-xs text-left">
              {info.address}
            </p>

            <div className="flex w-[140px] justify-between ">
              <span className="inline-block mt-0.5 font-semibold text-secondary-content">
                {reviewInfo.averageRate}
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
                    width: `${Number(reviewInfo.averageRate) * starWidth}px`,
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
              <span className="inline-block mt-0.5">
                ({reviewInfo.reviewLength})
              </span>
            </div>
          </div>
        </div>
        <KakaoMap mapOption={mapOption} />
      </div>
    </>
  );
};

export default StoreInfo;
