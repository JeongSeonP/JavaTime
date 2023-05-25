import { CgSpinner } from "react-icons/Cg";
import { BsFillCheckCircleFill } from "react-icons/Bs";

interface Prop {
  loading: boolean;
}

const SuccessModal = ({ loading }: Prop) => {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0">
      <div className="absolute w-[300px] rounded-full overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 card bg-base-100  shadow-xl">
        <div className="flex items-center justify-center card-body bg-[#f2e8f7] text-sm h-36 font-semibold text-center ">
          {loading ? (
            <div className="animate-spin">
              <CgSpinner className="ico-coffeeBean text-neutral-content text-4xl" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <BsFillCheckCircleFill
                size="22"
                className="text-[#fff] mb-2 -mt-4"
              />
              <p className="">리뷰가 등록되었습니다!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SuccessModal;
