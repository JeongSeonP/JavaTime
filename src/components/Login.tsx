import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseAuth";
import { useEffect, useRef, useState } from "react";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, GGuser, GGloading, GGerror] =
    useSignInWithGoogle(auth);

  useEffect(() => {
    if (user || GGuser) {
      setEmail("");
      setPassword("");
      navigate("/");
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

  // const handleLoginSubmit = async (e: React.FormEvent) => {
  //   setErrorMsg("");
  //   e.preventDefault();
  //   try {
  //     const user = await signInWithEmailAndPassword(auth, email, password);
  //     setEmail("");
  //     setPassword("");
  //     navigate("/");
  //     //홈화면으로 이동, 로그인페이지로 오면 로그아웃이 보이거나 해야겠다.
  //     //받아온 토큰은 어떠케 관리할지 확인
  //     console.log(user);
  //   } catch (err) {
  //     if (err instanceof FirebaseError) {
  //       switch (err.code) {
  //         case "auth/user-not-found":
  //           setErrorMsg("가입되지 않은 사용자입니다.");
  //           setEmail("");
  //           setPassword("");
  //           emailRef.current?.focus();
  //           break;
  //         case "auth/wrong-password":
  //           setErrorMsg("PASSWORD가 올바르지 않습니다.");
  //           setPassword("");
  //           passwordRef.current?.focus();
  //           break;
  //       }
  //     }
  //   }
  // };

  return (
    <main className="py-20">
      <div className="w-80 mx-auto text-center">
        <form onSubmit={handleLoginSubmit}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailRef}
            type="email"
            name="email"
            placeholder="E-MAIL"
            className="placeholder:text-sm input w-full max-w-xs input-bordered rounded-lg mb-2 shadow"
            autoFocus
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordRef}
            type="password"
            name="password"
            placeholder="PASSWORD"
            className="placeholder:text-sm input w-full max-w-xs input-bordered rounded-lg mb-2 shadow"
          />
          <p className="text-error text-right text-xs h-5">{errorMsg}</p>
          <button className="btn w-full rounded-lg shadow-md no-animation my-2">
            로그인
          </button>
        </form>
        <button
          onClick={handleGGLogin}
          className="btn w-full rounded-lg shadow-md no-animation my-2"
        >
          구글 로그인
        </button>
        <Link to={"/join"} className="my-4">
          회원가입
        </Link>
      </div>
    </main>
  );
}
