import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../api/firebase";
import { Link, useNavigate } from "react-router-dom";
import cx from "clsx";
import { BsFillPersonFill } from "react-icons/Bs";

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
    <div className="md:w-16 ">
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
              <BsFillPersonFill size="40" className="mt-1" />
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
                <Link to={"/login"} className="font-semibold text-xs ">
                  <span className="">로그인</span>
                </Link>
              </li>
              <li>
                <Link to={"/join"} className="font-semibold text-xs ">
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
