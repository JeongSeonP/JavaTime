import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreDocumentData } from "./Table";
import { storage } from "../api/firebase";
import { getDownloadURL, list, ref } from "firebase/storage";
import StarRate from "./StarRate";

interface Props {
  store: StoreDocumentData;
}

const TableItem = ({ store }: Props) => {
  const navigate = useNavigate();
  const [storeImage, setStoreImage] = useState<string | null>(null);

  const averageRate = (store.ttlRate / store.ttlParticipants)
    .toFixed(1)
    .toString();

  useEffect(() => {
    const getUrl = async () => {
      const listRef = ref(storage, `store/${store.id}`);
      try {
        const imgList = await list(listRef, { maxResults: 1 });
        if (imgList) {
          const url = await getDownloadURL(imgList.items[0]);
          setStoreImage(url);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getUrl();
  }, [store]);

  return (
    <div className="card card-compact  bg-base-100 shadow-xl">
      <figure className="h-60 bg-base-200">
        {storeImage ? (
          <img src={storeImage} alt="리뷰이미지" />
        ) : (
          <i className="ico-coffeeBean text-base-300 text-7xl"></i>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{store.storeName}</h2>
        <div className="flex w-[140px] justify-between ">
          <span className="inline-block mt-0.5 font-semibold text-secondary-content">
            {averageRate}
          </span>
          <StarRate rate={averageRate} />
          <span className="inline-block mt-0.5">({store.ttlParticipants})</span>
        </div>
        <div className="card-actions justify-end">
          <button
            onClick={() => navigate(`/store/${store.id}`)}
            className="btn btn-ghost btn-sm text-xs bg-base-200 hover:bg-base-300"
          >
            더보러가기
          </button>
        </div>
      </div>
    </div>
  );
};
export default TableItem;
