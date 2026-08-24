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
  onClose?: () => void;
  currentLocation?: string;
  title?: string;
  subtitle?: string;
}

function LocationModal({
  onSelect,
  userName,
  isPending,
  onClose,
  currentLocation,
  title,
  subtitle,
}: LocationModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && onClose) {
      onClose();
    }
  };

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} role="dialog" aria-modal="true">
        <h3 className={css.title}>{title ?? `Welcome, ${userName}!`}</h3>
        <p className={css.subtitle}>
          {subtitle ?? 'Where are you working today?'}
        </p>
        <div className={css.buttons}>
          {LINES.map(line => (
            <button
              key={line.value}
              className={css.lineBtn}
              onClick={() => onSelect(line.value)}
              disabled={isPending || line.value === currentLocation}
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
