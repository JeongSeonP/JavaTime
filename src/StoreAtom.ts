import { atom } from "recoil";

export const selectedStore = atom({
  key: "@selectedStore",
  default: {
    id: "",
    storeName: "",
    address: "",
    x: "",
    y: "",
  },
});

// address_name: "서울 종로구 공평동 17"
// category_group_code: "CE7"
// category_group_name: "카페"
// category_name: "음식점 > 카페"
// distance: ""
// place_url: "http://place.map.kakao.com/517442171"
// phone: "02-6370-5840"
// place_name: "",
// road_address_name: "",
// id: "",
// x: "",
// y: "",
