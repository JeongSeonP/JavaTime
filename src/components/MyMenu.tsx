import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../api/firebase";
import { Link } from "react-router-dom";
import cx from "clsx";
import { ReactHTMLElement, ReactNode } from "react";

const MyMenu = () => {
  const [isLogin] = useAuthState(auth);
  const [signOut, loading, error] = useSignOut(auth);
  const isOnline = !!isLogin;

  const handleSignOut = async () => {
    await signOut();
    localStorage.setItem("isLogin", "false");
    if (error) {
      throw new Error("로그아웃실패");
    }
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
          className="mt-3 px-1 py-2.5 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-28 "
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
                <Link to={"/login"}>로그인</Link>
              </li>
              <li>
                <Link to={"/join"}>회원가입</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyMenu;
