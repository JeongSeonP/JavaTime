import { Link } from "react-router-dom";
import MyMenu from "./MyMenu";

const Header = () => {
  return (
    <header className="h-24 p-5 bg-base-200 fixed top-0 left-0 right-0 z-[9999] shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="w-52 text-2xl font-black text-center ">
          <Link
            to={"/"}
            className="flex justify-start sm:justify-center items-center"
          >
            <svg
              className="w-12 h-12 sm:w-10 sm:h-10 inline-block px-2 "
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="124.000000pt"
              height="120.000000pt"
              viewBox="0 0 124.000000 120.000000"
              preserveAspectRatio="xMidYMid meet"
              fill="currentColor"
            >
              <g
                transform="translate(0.000000,120.000000) scale(0.100000,-0.100000)"
                stroke="none"
              >
                <path
                  d="M725 1186 c-59 -12 -176 -61 -225 -96 -14 -9 -37 -20 -51 -23 -14 -4
-43 -20 -65 -37 -21 -17 -48 -37 -59 -45 -52 -38 -165 -137 -165 -144 0 -4
-22 -44 -48 -88 -51 -84 -62 -109 -82 -183 -7 -25 -16 -55 -21 -68 -11 -29
-12 -199 -1 -206 5 -3 15 -31 22 -63 16 -71 26 -91 58 -121 26 -25 25 -25 150
-6 36 5 51 15 97 68 74 84 175 218 175 234 0 6 4 12 9 12 5 0 12 13 16 28 3
16 19 43 35 61 16 17 49 62 73 99 49 75 93 122 113 122 8 0 14 4 14 9 0 9 134
91 149 91 11 0 71 33 134 74 98 63 122 128 67 181 -16 16 -30 33 -30 38 0 6
-11 25 -26 44 l-25 33 -127 -1 c-70 -1 -154 -6 -187 -13z"
                />
                <path
                  d="M1155 936 c-14 -14 -25 -30 -25 -36 0 -11 -53 -91 -77 -117 -6 -7
-42 -29 -80 -49 -77 -40 -151 -89 -204 -137 -20 -18 -49 -42 -64 -55 -40 -33
-115 -133 -115 -153 0 -18 -175 -198 -257 -267 -35 -28 -43 -41 -43 -68 0 -18
5 -36 11 -40 19 -11 220 -7 232 5 6 6 21 11 34 11 12 0 51 9 85 19 35 11 82
24 105 30 113 30 360 303 408 451 10 30 29 76 42 102 19 38 24 66 27 152 5
132 -2 170 -32 174 -13 2 -32 -7 -47 -22z"
                />
              </g>
            </svg>
            <span className="sr-only sm:not-sr-only">JAVA TIME</span>
          </Link>
        </h1>
        <MyMenu />
      </div>
    </header>
  );
};

export default Header;
