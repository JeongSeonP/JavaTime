import { useAuthState } from "react-firebase-hooks/auth";
import Board from "../components/Board";
import { auth, getDocUser } from "../api/firebase";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { useQuery } from "react-query";
import { favoriteFlavor, favoriteType } from "../components/SelectOptions";
import { useNavigate } from "react-router-dom";

export interface UserDocumentData extends DocumentData {
  favoriteFlavor: "sour" | "nutty";
  favoriteType: "americano" | "cafelatte" | "drip";
  isPublic: boolean;
}

const MyPage = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { data: userDoc } = useQuery(["user", user?.uid], () =>
    getDocUser(user?.uid)
  );

  return (
    <main className="pt-10 pb-20">
      <div className="mx-auto text-center font-semibold text-sm">
        <Board title="MY PAGE">
          <h3 className="text-sm mb-8">
            <span className="text-primary-focus mr-2">
              {user?.displayName ?? user?.email}
            </span>
            님의 프로필
          </h3>

          <div className="max-w-[500px] mx-auto mt-4 ">
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden bg-[#fff] text-primary shadow-lg">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  className="w-full"
                  alt="프로필이미지"
                />
              ) : (
                <svg
                  className="w-40 mt-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
              )}
            </div>
            {userDoc ? (
              <>
                <div className="font-semibold mr-2 mt-6">
                  <p>
                    <i className="ico-coffeeBean mr-1"></i>나의 커피취향
                  </p>
                  <div className="flex justify-center items-center p-4 text-center">
                    <div className="flex justify-center items-center mr-7">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-check-circle-fill text-primary mr-2"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                      </svg>
                      <p className="font-normal">
                        {favoriteFlavor[userDoc.favoriteFlavor]}
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-check-circle-fill text-primary mr-2"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                      </svg>
                      <p className="font-normal">
                        {favoriteType[userDoc.favoriteType]}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="divider my-1"></div>
                <div className="font-semibold mr-2 my-6 mb-10">
                  <p>
                    <i className="ico-coffeeBean mr-1"></i>프로필 공개여부
                  </p>
                  <div className="flex justify-center items-center p-4 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-check-circle-fill text-primary mr-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    <p className="font-normal">
                      {userDoc.isPublic ? "공개" : "비공개"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="font-semibold mr-2 my-6 mb-10">
                <p>프로필 등록하고 나의 커피취향을 공유해보세요.</p>
                <p>가고싶은 카페를 찾는데 도움이 될거에요!</p>
              </div>
            )}
          </div>

          <button
            role="button"
            onClick={() => navigate("/profile")}
            className="text-sm font-semibold hover:bg-base-300 bg-base-200 p-3 px-5 mt-1 rounded-full"
          >
            프로필 수정하기
          </button>
        </Board>
      </div>
    </main>
  );
};
export default MyPage;
