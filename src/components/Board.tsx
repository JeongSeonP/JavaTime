import { ReactNode } from "react";

interface Contents {
  children: ReactNode;
  title: string;
}

const Board = (props: Contents) => {
  return (
    <>
      <h2 className="flex justify-center items-center mx-auto w-40  h-10  translate-y-3 font-semibold rounded-full shadow bg-base-100 text-base-dark-color">
        {props.title}
      </h2>
      <article className="flex-col justify-center mx-auto w-screen lg:w-2/3 md:max-w-3xl py-10 md:px-20 px-10 rounded-3xl border border-base-200 shadow text-base-dark-color">
        {props.children}
      </article>
    </>
  );
};
export default Board;
