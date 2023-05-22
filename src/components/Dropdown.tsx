import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Dropdown = (props: Props) => {
  const handleFocus = () => {
    const element = document.activeElement;
    if (element) {
      (element as HTMLElement).blur();
    }
  };

  return (
    <div className="dropdown dropdown-end ml-1">
      <label tabIndex={0} className="btn btn-ghost btn-xs btn-circle avatar">
        <button className="btn btn-square btn-ghost border border-base-300 btn-xs ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current rotate-90"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
      </label>
      <ul
        tabIndex={0}
        className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-22"
        onClick={handleFocus}
      >
        {props.children}
      </ul>
    </div>
  );
};

export default Dropdown;
