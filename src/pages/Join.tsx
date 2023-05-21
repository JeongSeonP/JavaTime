import { auth } from "../api/firebase";
import { useEffect, useRef, useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import FormBoard from "../components/FormBoard";

const Join = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating, profileError] = useUpdateProfile(auth);

  //로그인, 조인 : 커스텀훅으로 해보기? -이미 훅 사용중이라..
  //react-hook-form으로 바꿔보기
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
    await createUserWithEmailAndPassword(email, password);
    if (displayName !== "") {
      await updateProfile({ displayName });
    }
  };

  return (
    <main className="py-20">
      <div className=" mx-auto text-center ">
        <FormBoard
          title="회원가입"
          submitBtn="가입하기"
          onSubmit={handleRegisterSubmit}
        >
          <div className="flex justify-center items-center mb-2">
            <label
              htmlFor="registeredNickname"
              className="block w-24 text-left font-semibold text-xs md:text-sm"
            >
              NICKNAME{" "}
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              type="text"
              id="registeredDisplayName"
              name="displayName"
              placeholder="displayName"
              className="placeholder:text-sm input w-full max-w-xs input-bordered input-primary rounded-lg  "
            />
          </div>
          <div className="flex justify-center items-center mb-2">
            <label
              htmlFor="registeredEmail"
              className="block w-24 text-left font-semibold text-xs md:text-sm"
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
              className="placeholder:text-sm input w-full max-w-xs input-bordered input-primary rounded-lg  "
            />
          </div>
          <div className="flex justify-center items-center mb-2">
            <label
              htmlFor="registeredPW"
              className="block w-24 text-left font-semibold text-xs md:text-sm"
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
              className="placeholder:text-sm input w-full max-w-xs input-bordered input-primary rounded-lg "
            />
          </div>
          <p className="text-error text-right text-xs h-5">{errorMsg}</p>
        </FormBoard>
      </div>
    </main>
  );
};
export default Join;
