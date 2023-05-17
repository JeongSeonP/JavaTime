import { Dispatch, SetStateAction } from "react";

interface props {
  value: string;
  dispatchValue: Dispatch<SetStateAction<string>>;
  handler: (e: React.FormEvent) => void;
  placeHolder: string;
}

const SearchBar = ({ value, dispatchValue, handler, placeHolder }: props) => {
  return (
    <form
      onSubmit={handler}
      className="input-group flex justify-center relative"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => dispatchValue(e.target.value)}
        placeholder={placeHolder}
        spellCheck={false}
        className="input input-bordered w-[400px] bg-[#fff] placeholder:text-xs focus:outline-none"
        autoFocus
      />
      <button
        type="button"
        onClick={() => dispatchValue("")}
        className="w-4 h-4 border rounded-full text-xs text-neutral-400 flex justify-center items-center hover:bg-neutral-400 hover:text-base-100 absolute top-1/2 -translate-y-1/2 right-14 transition duration-200 ease-in-out"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
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
