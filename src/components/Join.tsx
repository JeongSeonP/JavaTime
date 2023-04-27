import { auth } from "../firebaseAuth";
import { useEffect, useRef, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export default function Join() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (user) {
      setEmail("");
      setPassword("");
      navigate("/");
    }
    if (error) {
      console.log(error);
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMsg("이미 가입된 email주소입니다.");
          setEmail("");
          setPassword("");
          emailRef.current?.focus();
          break;
        case "auth/invalid-email":
          setErrorMsg("잘못된 email주소입니다.");
          setEmail("");
          setPassword("");
          emailRef.current?.focus();
          break;
        case "auth/weak-password":
          setErrorMsg("PASSWORD는 최소 6자 이상이어야 합니다.");
          setPassword("");
          passwordRef.current?.focus();
          break;
      }
    }
  }, [user, error]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    setErrorMsg("");
    e.preventDefault();
    const res = await createUserWithEmailAndPassword(email, password);
    return res;
  };

  // const handleRegisterSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const { user } = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     //로그인페이지로 가야하나?
  //   } catch (err) {
  //     if (err instanceof FirebaseError) {
  //       switch (err.code) {
  //         case "auth/email-already-in-use":
  //           setErrorMsg("이미 가입된 email주소입니다.");
  //           setEmail("");
  //           setPassword("");
  //           emailRef.current?.focus();
  //           break;
  //         case "auth/invalid-email":
  //           setErrorMsg("잘못된 email주소입니다.");
  //           setEmail("");
  //           setPassword("");
  //           emailRef.current?.focus();
  //           break;
  //         case "auth/weak-password":
  //           setErrorMsg("password는 최소 6자 이상이어야 합니다.");
  //           setPassword("");
  //           passwordRef.current?.focus();
  //           break;
  //       }
  //     }
  //   }
  // };

  return (
    <main className="py-20">
      <div className=" mx-auto w-[600px] p-10 text-center rounded-lg border border-base-200 shadow-md">
        <form onSubmit={handleRegisterSubmit}>
          <fieldset className="">
            <legend className="flex justify-center items-center w-32 h-10  -translate-y-16 font-semibold rounded-full shadow bg-base-100">
              회원가입
            </legend>
            <div className="flex justify-center items-center">
              <label
                htmlFor="registeredEmail"
                className="block w-24 text-left font-semibold text-sm"
              >
                E-MAIL{" "}
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
                type="email"
                id="registeredEmail"
                name="email"
                placeholder="example@example.com"
                className="placeholder:text-sm input w-full max-w-xs input-bordered rounded-lg mb-2 shadow"
              />
            </div>
            <div className="flex justify-center items-center">
              <label
                htmlFor="registeredPW"
                className="block w-24 text-left font-semibold text-sm"
              >
                PASSWORD{" "}
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef}
                type="password"
                name="password"
                id="registeredPW"
                placeholder="비밀번호는 6자 이상으로 만들어주세요."
                className="placeholder:text-sm input w-full max-w-xs input-bordered rounded-lg mb-2 shadow"
              />
            </div>
            <p className="text-error text-right text-xs h-5">{errorMsg}</p>
            <button className="btn  rounded-lg shadow-md no-animation my-8">
              가입하기
            </button>
          </fieldset>
        </form>
      </div>
    </main>
  );
}
