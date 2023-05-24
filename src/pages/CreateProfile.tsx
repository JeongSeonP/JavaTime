import { useNavigate } from "react-router-dom";
import FormBoard from "../components/FormBoard";
import { useState } from "react";
import ImageUploader, { Imagefile } from "../components/ImageUploader";
import { useForm } from "react-hook-form";
import { favoriteFlavor, favoriteType } from "../components/SelectOptions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, setDocUser, storage } from "../api/firebase";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { useMutation, useQueryClient } from "react-query";

interface ProfileForm {
  displayName: string;
  flavor: string;
  type: string;
  isPublic: boolean;
}

const CreateProfile = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imgFile, setImgFile] = useState<Imagefile | null>(null);
  const [updateProfile, updating, profileError] = useUpdateProfile(auth);
  const { mutate: userMutate, isLoading } = useMutation(setDocUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user", user?.uid]);
    },
  });
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit: onSubmit,
    watch,
    reset,
  } = useForm<ProfileForm>({
    mode: "onSubmit",
    defaultValues: {
      displayName: "",
      flavor: "",
      type: "",
      isPublic: true,
    },
  });
  const isPublic = watch("isPublic");

  const getUrl = async (uid: string | undefined) => {
    if (!imgFile || !imgFile.file) return;
    const imageRef = ref(storage, `user/${uid}`);
    try {
      const res = await uploadBytes(imageRef, imgFile.file);
      const url = await getDownloadURL(res.ref);
      return url;
    } catch (e) {
      throw new Error("error");
    }
  };

  const handleSubmit = async (formData: ProfileForm) => {
    if (!user) return;
    const { uid } = user;
    const { displayName, flavor, type, isPublic } = formData;
    const userDoc = {
      favoriteFlavor: flavor,
      favoriteType: type,
      isPublic: isPublic,
    };
    userMutate({ uid, userDoc });

    if (imgFile) {
      const photoURL = await getUrl(uid);
      await updateProfile({ displayName, photoURL });
    } else {
      await updateProfile({ displayName, photoURL: "" });
    }
    navigate("/mypage");
  };

  return (
    <main className="pt-10 pb-20 ">
      <div className=" mx-auto text-center ">
        <FormBoard
          title="프로필 작성하기"
          submitBtn="프로필 등록"
          onSubmit={onSubmit(handleSubmit)}
        >
          <div className="flex justify-center items-center">
            <label
              htmlFor="nickname"
              className="block w-24 text-left font-semibold text-sm"
            >
              닉네임{" "}
            </label>
            <input
              type="text"
              id="nickname"
              maxLength={10}
              spellCheck={false}
              placeholder="닉네임은 10자 이내로 지어주세요."
              className="placeholder:text-xs input w-3/5 max-w-xs input-bordered input-primary bg-[#fff] rounded-xl "
              {...register("displayName", {
                required: true,
              })}
            />
          </div>
          <div className="max-w-[500px] mx-auto mt-4 text-sm">
            <div className="text-left  font-semibold mr-2 my-6">
              자신의 커피취향을 선택해보세요.
            </div>
            <div className="flex items-center justify-between">
              <div className="inline-block w-20 font-semibold text-left">
                원두
              </div>
              {Object.entries(favoriteFlavor).map(([value, description]) => (
                <label
                  key={value}
                  className="label cursor-pointer w-1/3 justify-start"
                >
                  <input
                    type="radio"
                    className="radio radio-sm mr-2"
                    value={value}
                    {...register("flavor", {
                      required: true,
                    })}
                  />
                  <span className="label-text text-xs">{description}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between text-center mb-6">
              <div className="inline-block w-20 font-semibold text-left md:mr-10 ">
                커피종류
              </div>
              {Object.entries(favoriteType).map(([value, description]) => (
                <label
                  key={value}
                  className="label cursor-pointer w-1/3 justify-start"
                >
                  <input
                    type="radio"
                    className="radio radio-sm mr-2"
                    value={value}
                    {...register("type", {
                      required: true,
                    })}
                  />
                  <span className="label-text text-xs">{description}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="max-w-[500px] mx-auto my-4 text-sm">
            <div className="text-left  font-semibold mr-2 my-6">
              프로필 사진을 등록해보세요.
              <span className="text-xs font-normal ml-2">(선택 항목)</span>
            </div>
            <ImageUploader dispatch={setImgFile} img={imgFile} />
          </div>
          <div className="form-control w-40 mx-auto">
            <label className="label cursor-pointer">
              <span className="label-text font-semibold text-sm">
                {isPublic ? "프로필 공개" : "프로필 미공개"}
              </span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                defaultChecked
                {...register("isPublic", {
                  required: true,
                })}
              />
            </label>
          </div>
        </FormBoard>
      </div>
    </main>
  );
};
export default CreateProfile;
