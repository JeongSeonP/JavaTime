import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../api/firebase";
import { Link, useNavigate } from "react-router-dom";
import cx from "clsx";
import { ReactHTMLElement, ReactNode } from "react";

const MyMenu = () => {
  const [isLogin] = useAuthState(auth);
  const [signOut, loading, error] = useSignOut(auth);
  const navigate = useNavigate();
  const isOnline = !!isLogin;

  const handleSignOut = async () => {
    await signOut();
    localStorage.setItem("isLogin", "false");
    if (error) {
      throw new Error("로그아웃실패");
    }
    navigate("/login");
  };

  const handleFocus = () => {
    const element = document.activeElement;
    if (element) {
      (element as HTMLElement).blur();
    }
  };

  return (
    <div className="w-12 ">
      <div tabIndex={0} className=" dropdown dropdown-end ">
        <label
          className={cx(
            " btn btn-ghost btn-circle avatar",
            { ["offline hover:bg-primary/20"]: !isOnline },
            { ["online hover:bg-primary/60"]: isOnline }
          )}
        >
          <div className="w-10 rounded-full bg-base-100 text-primary shadow">
            {isLogin?.photoURL ? (
              <img src={isLogin.photoURL} alt="프로필이미지" />
            ) : (
              <svg
                className="w-14 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 22"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
            )}
          </div>
        </label>
        <ul
          onClick={handleFocus}
          tabIndex={0}
          className="mt-3 px-1 py-2.5 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-28"
        >
          {isLogin ? (
            <>
              <li className="">
                <Link to={"/mypage"} className="font-semibold text-xs">
                  마이페이지
                </Link>
              </li>
              <li>
                <Link to={"/profile"} className="font-semibold text-xs">
                  프로필등록
                </Link>
              </li>
              <li onClick={handleSignOut}>
                <a className="font-semibold text-xs">로그아웃</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={"/login"} className="font-semibold text-xs px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="w-1/4 text-[#7a6287]"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                  </svg>
                  <span className="">로그인</span>
                </Link>
              </li>
              <li>
                <Link to={"/join"} className="font-semibold text-xs px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="w-1/4 text-[#7a6287]"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  </svg>
                  <span className="shrink-0 ">회원가입</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyMenu;
