import { createPortal } from 'react-dom';
import { useEffect } from 'react';

import { CircleX } from 'lucide-react';

import css from './ModalOverlay.module.css';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

function ModalOverlay({ onClose, children }: ModalProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} role="dialog" aria-modal="true">
        <button
          type="button"
          onClick={onClose}
          className={css.btn}
          aria-label="Close modal"
        >
          <CircleX size={26} strokeWidth={1} />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}
export default ModalOverlay;
