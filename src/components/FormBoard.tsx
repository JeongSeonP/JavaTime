import { ReactNode } from "react";

interface Contents {
  children: ReactNode;
  title: string;
  submitBtn: string;
  onSubmit: (e: React.FormEvent) => void;
}

const FormBoard = (props: Contents) => {
  return (
    <>
      <article className="flex-col justify-center mx-auto w-screen lg:w-2/3 md:max-w-3xl py-10 md:px-20 px-4 rounded-3xl border border-base-200 shadow text-base-dark-color mt-10">
        <h2 className="flex justify-center items-center -translate-y-16 mx-auto w-40  h-10  font-semibold rounded-full shadow bg-base-100 text-base-dark-color ">
          {props.title}
        </h2>
        <form onSubmit={props.onSubmit}>
          <fieldset className="">
            <legend className="sr-only">{props.title}</legend>
            {props.children}
            <button className="btn btn-wide rounded-full shadow-md no-animation my-8 block mx-auto">
              {props.submitBtn}
            </button>
          </fieldset>
        </form>
      </article>
    </>
  );
};
export default FormBoard;
