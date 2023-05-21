import { Link } from "react-router-dom";
import MyMenu from "./MyMenu";

const Header = () => {
  return (
    <header className="h-24 p-5 bg-base-200 fixed top-0 left-0 right-0 z-[9999] shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="sm:w-52 w-10 text-2xl font-black text-center ">
          <Link
            to={"/"}
            className="flex justify-start sm:justify-center items-center"
          >
            <i className="ico-coffeeBean inline-block px-2 md:text-2xl text-3xl "></i>
            <span className="sr-only sm:not-sr-only">JAVA TIME</span>
          </Link>
        </h1>
        <MyMenu />
      </div>
    </header>
  );
};

export default Header;
