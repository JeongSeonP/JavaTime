import { useRef, useState } from "react";
import { Control, UseFormRegister, Controller } from "react-hook-form";
import { ReviewForm } from "../pages/CreateReview";

interface Imagefile {
  file: File;
  thumnail: string;
  name: string;
}

const ImageUploader = () => {
  const [imgFile, setImgFile] = useState<Imagefile | null>(null);
  // const imgRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList[0]) {
      const url = URL.createObjectURL(fileList[0]);
      setImgFile({
        file: fileList[0],
        thumnail: url,
        name: fileList[0].name,
      });
      console.log(fileList[0]);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center text-sm font-semibold">
        <label
          htmlFor="imageInput"
          className="w-20 bg-primary/50 hover:bg-primary/70 h-36 rounded-l-lg shadow flex items-center justify-center"
        >
          사진
          <br />
          선택
        </label>
        <div className="w-36 h-36 inline-block my-3 rounded-r-lg shadow bg-[#fff] overflow-hidden relative">
          <img
            src={imgFile?.thumnail}
            alt={imgFile?.name}
            className="inline-block"
          />
          <button
            onClick={() => setImgFile(null)}
            className="w-5 h-5 border rounded-full text-primary flex justify-center items-center bg-[#fff] hover:bg-primary hover:text-base-100 absolute top-1 right-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        id="imageInput"
        onChange={handleImage}
        className="hidden"
      />
    </>
  );
};

export default ImageUploader;
