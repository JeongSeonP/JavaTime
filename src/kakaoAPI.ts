import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";

//카카오 로컬 테스트
//리뷰 작성시 기존 데이터 없을때 카카오통해서 업체 검색 -> x,y값기준 근처 지하철역검색결과를 포함한 데이터 생성해서 firestore에 저장
//리뷰 검색할때 지하철역 기준으로도 검색 할 수 있도록.

const KAKAO_REST_API_KEY = "6141e6d9b8577c45a9f067edf98ffea3";

interface documents {
  place_name: string;
}

export const getStation = async (x: string, y: string) => {
  const { data } = await axios.get(
    `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=SW8&y=${y}&x=${x}&radius=1000`,
    {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    }
  );
  const stationList = data.documents.map((data: documents) =>
    data.place_name.slice(0, -4)
  );
  return stationList;
};

export const getSearchedStoreInfo = async (storeName: string, page: string) => {
  const { data } = await axios.get(
    `https://dapi.kakao.com/v2/local/search/keyword.json?category_group_code=CE7&query=${storeName}&page=${page}&size=5`,
    {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
      },
    }
  );

  const placeInfo = data.documents;
  const isEnd = data.meta.is_end;

  return [placeInfo, isEnd];
};

// export const useStore = (storeName: string, page: string) => {
//   return useQuery(["storeInfo"], () => getSearchedStoreInfo(storeName, page));
// };
