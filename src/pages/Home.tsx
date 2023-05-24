import { Link } from "react-router-dom";
import StorePageSearch from "./StorePageSearch";
import Table from "../components/Table";
import { BsChatHeartFill } from "react-icons/Bs";
import SearchReview from "../components/InputDispatch";
import Loading from "../components/Loading";

//홈에서 리뷰 검색하면 리뷰검색하는 페이지로 이동해서 보게 하기
const Home = () => {
  return (
    <main className="py-5">
      <div className="w-4/5 mx-auto text-center">
        <section className="form-control py-5 items-center">
          <div className="flex flex-col justify-center items-center w-80 text-xs mb-4 p-3 px-8 bg-[#f7eefc] rounded-full font-semibold text-[#927c68] shadow-md shadow-base-200">
            <p>커피에 진심이신가요?</p>
            <p className="flex items-center h-6">
              <i className="ico-coffeeBean inline-block mt-0.5 mr-0.5"></i>
              <span className="inline-block">
                Java Time에서 커피리뷰를 공유해보세요!
              </span>
            </p>
          </div>
          <div className="w-[350px]">
            <SearchReview />
          </div>
        </section>
        <section>
          <button className="btn border-none bg-[#391b48] text-xs hover:scale-105 transition-transform duration-200 ease-in-out shadow-md">
            <Link to={"/review"} className="flex items-center h-full">
              리뷰 쓰러 가기
              <BsChatHeartFill className="ml-1 text-secondary-focus" />
            </Link>
          </button>
        </section>
        <section>
          <Table />
        </section>
      </div>
    </main>
  );
};
export default Home;
