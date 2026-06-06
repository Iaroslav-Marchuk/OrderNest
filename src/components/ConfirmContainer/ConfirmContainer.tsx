import css from './ConfirmContainer.module.css';

interface ConfirmContainerProps {
  text: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmContainer = ({
  text,
  onConfirm,
  onClose,
}: ConfirmContainerProps) => {
  return (
    <div className={css.wrapper}>
      <p className={css.text}>{text}</p>
      <div className={css.btns}>
        <button className={css.btnY} onClick={onConfirm}>
          Yes
        </button>
        <button className={css.btnN} onClick={onClose}>
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmContainer;
