import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import KakaoMap from "./KakaoMap";
import StarRate from "./StarRate";

// interface ReviewInfo {
//   reviewLength: number;
//   averageRate: string;
// }
// interface Props {
//   info: DocumentData;
// reviewInfo: ReviewInfo;
// }

const StoreInfo = ({ info }: DocumentData) => {
  const [mapOption, setMapOption] = useState({
    x: 0,
    y: 0,
    name: "",
    id: "",
  });
  const phoneNumber = `tel:${info.phone}`;
  const averageRate = (info.ttlRate / info.ttlParticipants)
    .toFixed(1)
    .toString();

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
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-xl">
        <div className="flex items-center justify-start md:justify-between mb-2 w-[350px]">
          <div className="flex items-center justify-center w-[130px] h-[130px] md:w-[150px] md:h-[150px] bg-[#fff] mr-2 border border-neutral-300 rounded-xl overflow-hidden shrink-0">
            <i className="ico-coffeeBean text-base-200 text-5xl"></i>
            {/* <img
              src="https://via.placeholder.com/150/fff"
              alt="업체리뷰이미지"
            /> */}
          </div>

          <div className="flex flex-col justify-between ml-1">
            <p className="max-w-[200px] md:max-w-[250px]  text-sm text-left mb-1 font-semibold">
              {info.address}
            </p>
            <div className="lex justify-center items-center md:text-sm text-xs text-left">
              {info.phone === "" ? null : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="inline-block w-2.5 mr-1 mb-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                    />
                  </svg>
                  <p className="inline-block">
                    <a href={phoneNumber}>{info.phone}</a>
                  </p>
                </>
              )}
            </div>

            <div className="flex w-[140px] justify-between ">
              <span className="inline-block mt-0.5 font-semibold text-secondary-content">
                {averageRate}
              </span>
              <StarRate rate={averageRate} />
              <span className="inline-block mt-0.5">
                ({info.ttlParticipants})
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
