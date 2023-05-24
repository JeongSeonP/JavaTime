import { useParams } from "react-router-dom";
import { getDocStore } from "../api/firebase";
import { useQuery } from "react-query";
import StoreInfo from "../components/StoreInfo";
import Review from "../components/Review";
import StoreLoading from "../components/StoreLoading";

const StorePage = () => {
  const { storeId } = useParams();
  const {
    data: storeDoc,
    isLoading,
    error,
  } = useQuery(["storeInfo", storeId], () => getDocStore(storeId));

  if (isLoading) {
    return <StoreLoading />;
  }
  if (!storeDoc || error) {
    return <main>업체정보가 없습니다.</main>;
  }

  return (
    <main className="pt-10 pb-20">
      <div className=" w-4/5 mx-auto text-center flex flex-col justify-center items-center">
        <h2 className="font-semibold  mb-4 text-lg flex justify-center items-center mx-auto w-fit px-7 h-12 rounded-full shadow ">
          {storeDoc.storeName}
        </h2>
        <StoreInfo storeDoc={storeDoc} map={true} />
        <Review storeDoc={storeDoc} />
      </div>
    </main>
  );
};

export default StorePage;
