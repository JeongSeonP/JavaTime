import { Link, useLocation } from "react-router-dom";
import MyMenu from "./MyMenu";
import { BiSearch } from "react-icons/bi";
import cx from "clsx";
import { useEffect, useState } from "react";
import InputDispatch from "./InputDispatch";

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const { pathname } = useLocation();
  const path = pathname !== "/" && pathname !== "/reviewsearch" ? true : false;

  useEffect(() => {
    setToggle(false);
  }, [pathname]);

  return (
    <header className="h-24 p-5 bg-base-200 fixed top-0 left-0 right-0 z-[9999] shadow">
      <div className="w-full lg:w-4/6 mx-auto flex justify-between items-center">
        <h1 className="sm:w-40 w-10 text-2xl">
          <Link
            to={"/"}
            className="flex justify-start sm:justify-center items-center"
          >
            <i className="ico-coffeeBean inline-block px-2 md:text-2xl text-3xl "></i>
            <span className="sr-only md:not-sr-only">JAVA TIME</span>
          </Link>
        </h1>
        <div className="flex justify-center items-center">
          {path ? (
            <button onClick={() => setToggle(true)}>
              <BiSearch size="29" className="mr-4 mt-1 text-[#dfaff7]" />
            </button>
          ) : null}
          <MyMenu />
        </div>
      </div>
      <div
        onClick={() => setToggle(false)}
        className={cx("modal z-[99998] bg-transparent", {
          ["visible opacity-100 pointer-events-auto "]: toggle,
        })}
      ></div>
      <div
        className={cx(
          "modal z-[99999] bg-transparent absolute  w-full top-[94px] h-14",
          {
            ["visible opacity-100 pointer-events-auto "]: toggle,
          }
        )}
      >
        <div className=" w-full md:max-w-lg">
          <InputDispatch />
        </div>
      </div>
    </header>
  );
};

export default Header;
