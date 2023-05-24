import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { searchedInput } from "../SearchInputAtom";
import { useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";

const InputDispatch = () => {
  const [searchInput, setSearchInput] = useRecoilState(searchedInput);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/reviewsearch");
  };

  useEffect(() => {
    setSearchInput("");
  }, []);

  return (
    <div className="relative ">
      <form
        onSubmit={handleSubmit}
        className="input-group flex justify-center border border-base-300 relative w-full rounded-full shadow-sm"
      >
        <SearchInput
          value={searchInput}
          dispatchValue={setSearchInput}
          placeHolder="지하철역 or 카페명으로 리뷰를 찾아보세요."
        />
      </form>
    </div>
  );
};
export default InputDispatch;
