import { ReactNode } from "react";

interface Contents {
  children: ReactNode;
  title: string;
  submitBtn: string;
  onSubmit: (e: React.FormEvent) => void;
}

const FormBoard = (props: Contents) => {
  return (
    <article className="flex-col justify-center mx-auto w-screen lg:w-2/3 md:max-w-3xl py-10 md:px-20 px-7 rounded-3xl border border-base-200 shadow text-base-dark-color mt-10">
      <form onSubmit={props.onSubmit}>
        <fieldset className="">
          <legend className="flex justify-center items-center px-10 h-10  -translate-y-16 font-semibold rounded-full shadow bg-base-100">
            {props.title}
          </legend>
          {props.children}
          <button className="btn btn-wide rounded-full shadow-md no-animation my-8 block mx-auto">
            {props.submitBtn}
          </button>
        </fieldset>
      </form>
    </article>
  );
};
export default FormBoard;
