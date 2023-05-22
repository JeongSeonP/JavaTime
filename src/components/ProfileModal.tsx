import { useQuery } from "react-query";
import { getDocUser } from "../api/firebase";
import { useEffect, useState } from "react";
import cx from "clsx";
import { favoriteFlavor, favoriteType } from "./SelectOptions";

interface UserData {
  email: string;
  displayName: string | null;
  uid: string;
  photo: string | null | undefined;
}

interface Props {
  user: UserData;
}

const ProfileModal = ({ user }: Props) => {
  const [toggle, setToggle] = useState(false);
  const { data: userDoc } = useQuery(["user", user.uid], () =>
    getDocUser(user.uid)
  );

  return (
    <>
      <div
        onClick={() => setToggle(true)}
        className="text-[#744959] font-semibold  hover:bg-base-200 cursor-pointer rounded-full py-1 px-3"
      >
        {user.displayName ?? user.email}
      </div>
      <div
        onClick={() => setToggle(false)}
        className={cx("modal z-[99999] bg-transparent", {
          ["visible opacity-100 pointer-events-auto "]: toggle,
        })}
      >
        <div className="modal-box bg-[#f2e8f7] text-center py-8">
          <label
            onClick={() => setToggle(false)}
            className="btn btn-xs btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <div className="font-bold text-lg mb-2">
            <span> {user.displayName ?? user.email}</span>
            <span> 님</span>{" "}
          </div>{" "}
          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-[#fff] text-primary shadow-lg">
            {user?.photo ? (
              <img src={user.photo} className="w-full" alt="프로필이미지" />
            ) : (
              <svg
                className="w-28 mt-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
            )}
          </div>
          {userDoc?.isPublic ? (
            <div className="font-semibold mr-2 mt-6 text-sm">
              <p>
                <i className="ico-coffeeBean mr-1"></i>나의 커피취향은?
              </p>
              <div className="flex justify-center items-center p-4 text-center">
                <div className="flex justify-center items-center mr-7">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-check-circle-fill text-[#fff] mr-2"
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
                    className="bi bi-check-circle-fill text-[#fff] mr-2"
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
          ) : (
            <p className="py-4 text-sm">프로필이 공개되지 않았습니다.</p>
          )}
        </div>
      </div>
    </>
  );
};
export default ProfileModal;
