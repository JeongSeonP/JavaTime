import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useRef, useState } from "react";
import {
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
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailRef}
            type="email"
            name="email"
            placeholder="E-MAIL"
            className="placeholder:text-sm input w-full max-w-xs input-bordered input-primary rounded-[15px] mb-2 "
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordRef}
            type="password"
            name="password"
            placeholder="PASSWORD"
            className="placeholder:text-sm input w-full max-w-xs input-bordered input-primary rounded-[15px] mb-2 "
          />
          <p className="text-error text-right text-xs h-5">{errorMsg}</p>
          <button className="btn  bg-neutral/90 hover:bg-neutral text-neutral-content w-full rounded-full shadow-md no-animation my-2">
            로그인
          </button>
        </form>
        <button
          onClick={handleGGLogin}
          className="btn  w-full rounded-full shadow-md no-animation my-2"
        >
          <svg
            className="w-4 mr-2"
            enableBackground="new 0 0 512 512"
            id="Layer_1"
            version="1.1"
            viewBox="0 0 512 512"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g>
              <path
                d="M42.4,145.9c15.5-32.3,37.4-59.6,65-82.3c37.4-30.9,80.3-49.5,128.4-55.2c56.5-6.7,109.6,4,158.7,33.4   c12.2,7.3,23.6,15.6,34.5,24.6c2.7,2.2,2.4,3.5,0.1,5.7c-22.3,22.2-44.6,44.4-66.7,66.8c-2.6,2.6-4,2.4-6.8,0.3   c-64.8-49.9-159.3-36.4-207.6,29.6c-8.5,11.6-15.4,24.1-20.2,37.7c-0.4,1.2-1.2,2.3-1.8,3.5c-12.9-9.8-25.9-19.6-38.7-29.5   C72.3,169,57.3,157.5,42.4,145.9z"
                fill="#E94335"
              />
              <path
                d="M126,303.8c4.3,9.5,7.9,19.4,13.3,28.3c22.7,37.2,55.1,61.1,97.8,69.6c38.5,7.7,75.5,2.5,110-16.8   c1.2-0.6,2.4-1.2,3.5-1.8c0.6,0.6,1.1,1.3,1.7,1.8c25.8,20,51.7,40,77.5,60c-12.4,12.3-26.5,22.2-41.5,30.8   c-43.5,24.8-90.6,34.8-140.2,31C186.3,501.9,133,477.5,89,433.5c-19.3-19.3-35.2-41.1-46.7-66c10.7-8.2,21.4-16.3,32.1-24.5   C91.6,329.9,108.8,316.9,126,303.8z"
                fill="#34A853"
              />
              <path
                d="M429.9,444.9c-25.8-20-51.7-40-77.5-60c-0.6-0.5-1.2-1.2-1.7-1.8c8.9-6.9,18-13.6,25.3-22.4   c12.2-14.6,20.3-31.1,24.5-49.6c0.5-2.3,0.1-3.1-2.2-3c-1.2,0.1-2.3,0-3.5,0c-40.8,0-81.7-0.1-122.5,0.1c-4.5,0-5.5-1.2-5.4-5.5   c0.2-29,0.2-58,0-87c0-3.7,1-4.7,4.7-4.7c74.8,0.1,149.6,0.1,224.5,0c3.2,0,4.5,0.8,5.3,4.2c6.1,27.5,5.7,55.1,2,82.9   c-3,22.2-8.4,43.7-16.7,64.5c-12.3,30.7-30.4,57.5-54.2,80.5C431.6,443.8,430.7,444.3,429.9,444.9z"
                fill="#4285F3"
              />
              <path
                d="M126,303.8c-17.2,13.1-34.4,26.1-51.6,39.2c-10.7,8.1-21.4,16.3-32.1,24.5C34,352.1,28.6,335.8,24.2,319   c-8.4-32.5-9.7-65.5-5.1-98.6c3.6-26,11.1-51,23.2-74.4c15,11.5,29.9,23.1,44.9,34.6c12.9,9.9,25.8,19.7,38.7,29.5   c-2.2,10.7-5.3,21.2-6.3,32.2c-1.8,20,0.1,39.5,5.8,58.7C125.8,301.8,125.9,302.8,126,303.8z"
                fill="#FABB06"
              />
            </g>
          </svg>
          구글 로그인
        </button>
      </article>
    </main>
  );
};

export default Login;
