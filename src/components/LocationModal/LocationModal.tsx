import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import css from './LocationModal.module.css';

const LINES = [
  { value: 'line_1', label: 'Line 1' },
  { value: 'line_2', label: 'Line 2' },
  { value: 'line_3', label: 'Line 3' },
];

interface LocationModalProps {
  onSelect: (line: string) => void;
  userName: string;
  isPending: boolean;
}

function LocationModal({ onSelect, userName, isPending }: LocationModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <div className={css.backdrop}>
      <div className={css.modal} role="dialog" aria-modal="true">
        <h3 className={css.title}>{`Bem vindo, ${userName}!`}</h3>
        <p className={css.subtitle}>Onde vais trabalhar hoje?</p>
        <div className={css.buttons}>
          {LINES.map(line => (
            <button
              key={line.value}
              className={css.lineBtn}
              onClick={() => onSelect(line.value)}
              disabled={isPending}
            >
              {isPending ? (
                <PulseLoader color="#9fb9e2ff" size={5} />
              ) : (
                line.label
              )}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LocationModal;
