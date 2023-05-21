// import { Link, useNavigate } from "react-router-dom";
// import Board from "../components/Board";
// import SearchBar from "../components/SearchBar";
// import StoreList from "../components/StoreList";
// import { useEffect, useState } from "react";
// import { StoreProps } from "./StoreSearch";
// import { getSearchedStoreInfo } from "../kakaoAPI";

// //회원만 리뷰 작성할 수 있게 해야함.
// //요페이지는 아예 없앨까봐

// const StoreSelect = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [searchedList, setSearchedLIst] = useState<StoreProps[]>([]);
//   const [page, setPage] = useState("");
//   const [lastPage, setLastPage] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [noResult, setNoResult] = useState(false);
//   const [isSelected, setisSelected] = useState(false);
//   const [modal, setModal] = useState(false);
//   const navigate = useNavigate();
//   const modalOption = {
//     h3: "선택된 카페가 없습니다. 카페를 선택해주세요.",
//     p: "카페선택을 계속하시려면 확인버튼을 눌러주세요.",
//     button: "확인",
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSearchedLIst([]);
//     setPage("1");
//     // getPage();
//   };

//   return (
//     <main className="pt-10 pb-20 ">
//       <div className=" mx-auto text-center">
//         <ul className="steps scale-75">
//           <li className="step step-primary  mr-3"></li>
//           <li className="step  before:scale-x-150 ml-3"></li>
//         </ul>
//         <Board title="카페 선택하기">
//           <SearchBar
//             value={searchInput}
//             dispatchValue={setSearchInput}
//             handler={handleSubmit}
//           />
//           <StoreList stores={[]} />
//           <div className="text-[14px] font-bold flex items-center justify-center h-6 my-3">
//             <div className="inline-block">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 fill="currentColor"
//                 viewBox="0 0 16 16"
//                 className="inline-block mr-2 mb-1 shrink-0"
//               >
//                 <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
//                 <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
//               </svg>
//               <span>찾으시는 카페가 없나요?</span>{" "}
//               <span className="block sm:inline">
//                 카페 검색해보고 첫 리뷰를 남겨주세요!
//               </span>
//             </div>
//           </div>
//           <button
//             onClick={() => navigate("/storesearch")}
//             className="ml-1 btn btn-sm btn-primary bg-primary/50 hover:bg-primary/70 border-none"
//           >
//             카페 찾아보기
//           </button>
//         </Board>
//         <div className="my-4">
//           <button
//             onClick={() => navigate("/review")}
//             className="w-28 btn btn-primary bg-primary/50 hover:bg-primary/70 border-none"
//           >
//             다음단계
//           </button>
//           <button
//             onClick={() => navigate("/")}
//             className="w-28 btn btn-active btn-ghost"
//           >
//             취소
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// };
// export default StoreSelect;
