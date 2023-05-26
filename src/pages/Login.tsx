import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../api/firebase";
import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/Io";
import { FcGoogle } from "react-icons/Fc";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectedFrom = location?.state?.redirectedFrom?.pathname || "/";
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, GGuser, GGloading, GGerror] =
    useSignInWithGoogle(auth);

  useEffect(() => {
    if (user || GGuser) {
      localStorage.setItem("isLogin", "true");
      setEmail("");
      setPassword("");
      navigate(redirectedFrom);
    }

    if (error || GGerror) {
      let errorCode;
      if (error) {
        errorCode = error.code;
      } else if (GGerror) {
        errorCode = GGerror.code;
      }

      switch (errorCode) {
        case "auth/user-not-found":
          setErrorMsg("가입되지 않은 사용자입니다.");
          setEmail("");
          setPassword("");
          emailRef.current?.focus();
          break;
        case "auth/invalid-email":
          setErrorMsg("EMAIL주소를 입력해주세요.");
          setEmail("");
          setPassword("");
          emailRef.current?.focus();
          break;
        case "auth/wrong-password":
          setErrorMsg("PASSWORD가 올바르지 않습니다.");
          setPassword("");
          passwordRef.current?.focus();
          break;
        case "auth/missing-password":
          setErrorMsg("PASSWORD를 입력해주세요.");
          setPassword("");
          passwordRef.current?.focus();
          break;
      }
    }
  }, [user, error, GGuser, GGerror]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    setErrorMsg("");
    e.preventDefault();

    const res = await signInWithEmailAndPassword(email, password);
    return res;
  };

  const handleGGLogin = async () => {
    const res = await signInWithGoogle();
    return res;
  };

  return (
    <main className="py-20">
      <article className="w-80 mx-auto text-center">
        <form onSubmit={handleLoginSubmit}>
          <div className="relative mb-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={emailRef}
              type="email"
              name="email"
              placeholder="E-MAIL"
              className="placeholder:text-xs input w-full max-w-xs bg-[#fff] input-bordered input-primary rounded-[15px]  "
            />
            {email === "" ? null : (
              <button
                type="button"
                onClick={() => setEmail("")}
                className="w-3 h-3 border rounded-full text-xs flex justify-center items-center bg-neutral-400 text-base-100 absolute top-1/2 -translate-y-1/2 right-4"
              >
                <IoIosClose />
              </button>
            )}
          </div>
          <div className="relative mb-2">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordRef}
              type="password"
              name="password"
              placeholder="PASSWORD"
              className="placeholder:text-xs input w-full max-w-xs bg-[#fff] input-bordered input-primary rounded-[15px]"
            />
            {password === "" ? null : (
              <button
                type="button"
                onClick={() => setPassword("")}
                className="w-3 h-3 border  rounded-full  flex justify-center items-center bg-neutral-400 text-base-100 absolute top-1/2 -translate-y-1/2 right-4"
              >
                <IoIosClose />
              </button>
            )}
          </div>
          <p className="text-error text-right text-xs h-5">{errorMsg}</p>
          <button className="btn  bg-neutral/90 hover:bg-neutral text-neutral-content w-full rounded-full shadow-md no-animation my-2">
            로그인
          </button>
        </form>
        <div className="divider my-1 text-xs">OR</div>
        <button
          onClick={handleGGLogin}
          className="btn  w-full rounded-full shadow-md no-animation my-2"
        >
          <FcGoogle size="18" className=" mr-2" />
          구글 로그인
        </button>
        <div className="text-right">
          <button
            onClick={() => navigate("/join")}
            className="link link-primary mx-6 text-[13px] text-primary-dark-color"
          >
            회원가입
          </button>
        </div>
      </article>
    </main>
  );
};

export default Login;
