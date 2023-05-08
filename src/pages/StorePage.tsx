import { useParams } from "react-router-dom";
import { getDocStore } from "../firebase";
import { useEffect, useState } from "react";

const StorePage = () => {
  const { storeId } = useParams();
  const [storeInfo, setStoreInfo] = useState();

  useEffect(() => {
    const storeDoc = async () => {
      if (storeId) {
        const storeDoc = await getDocStore(storeId);

        console.log(storeDoc);
        console.log(storeDoc?.review);

        //setStoreInfo()
      }
    };
    storeDoc();
  }, [storeId]);

  return (
    <main>
      <div>업체별페이지</div>
      <div>{}</div>
    </main>
  );
};

export default StorePage;
