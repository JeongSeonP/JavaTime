import cx from "clsx";

interface ModalProps {
  toggle: boolean;
  handleRedirect: (answer: boolean) => void;
  option: {
    h3: string;
    p: string;
    button: string;
    secondButton: boolean | string;
  };
}

const Modal = ({ toggle, handleRedirect, option }: ModalProps) => {
  return (
    <div
      className={cx("modal z-[99999]", {
        ["visible opacity-100 pointer-events-auto "]: toggle,
      })}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">{option.h3}</h3>
        <p className="py-4">{option.p}</p>
        <div className="modal-action">
          <label onClick={() => handleRedirect(true)} className="btn">
            {option.button}
          </label>
          {option.secondButton ? (
            <label onClick={() => handleRedirect(false)} className="btn">
              {option.secondButton}
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Modal;
