import { Dispatch, SetStateAction } from "react";

interface props {
  value: string;
  dispatchValue: Dispatch<SetStateAction<string>>;
  handler: (e: React.FormEvent) => void;
}

const SearchBar = ({ value, dispatchValue, handler }: props) => {
  return (
    <form onSubmit={handler} className="input-group flex justify-center">
      <input
        type="text"
        value={value}
        onChange={(e) => dispatchValue(e.target.value)}
        placeholder="Search..."
        spellCheck={false}
        className="input input-bordered w-[400px] bg-[#fff] focus:outline-none"
        autoFocus
      />
      <button className="btn btn-square">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
