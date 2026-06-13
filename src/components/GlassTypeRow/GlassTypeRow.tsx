import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GlassType } from '../../types/glassType';
import css from './GlassTypeRow.module.css';
import { deleteGlassTypeApi } from '../../services/glassTypesApi';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import GlassTypeForm from '../GlassTypeForm/GlassTypeForm';
import type { GlassCategory } from '../../types/glassCategory';
import clsx from 'clsx';

interface GlassTypeRowProps {
  glassType: GlassType;
  categoriesList: GlassCategory[];
  index: number;
}

function GlassTypeRow({ glassType, categoriesList, index }: GlassTypeRowProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteGlassType } = useMutation({
    mutationFn: deleteGlassTypeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGlassTypes'] });
      toast.success('Glass type deleted successfully!');
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const openEdit = () => setIsEditOpen(true);
  const closeEdit = () => setIsEditOpen(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const openConfirm = () => setIsConfirmOpen(true);
  const closeConfirm = () => setIsConfirmOpen(false);

  const handleDelete = () => {
    deleteGlassType(glassType._id);
    closeConfirm();
  };

  const createdAt = new Date(glassType.createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <>
      <tr className={css.row}>
        <td className={css.td}>{index}</td>
        <td className={css.td}>{glassType.label}</td>
        <td className={css.td}>{glassType.category.label}</td>
        <td className={css.td}>
          <div className={css.thicknessWrapper}>
            {glassType.thickness.map(t => (
              <span key={t} className={css.thicknessBadge}>
                {t}
              </span>
            ))}
          </div>
        </td>
        <td className={css.td}>
          <span className={clsx(css.temper, css[glassType.temper])}>
            {glassType.temper}
          </span>
        </td>
        <td className={css.td}>{createdAt}</td>
        <td className={css.td}>
          <div className={css.actions}>
            <button className={css.btn} onClick={openEdit} title="Edit">
              <Pencil size={16} strokeWidth={1.5} />
            </button>
            <button
              className={css.btnDelete}
              onClick={openConfirm}
              title="Delete"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        </td>
      </tr>

      {isEditOpen && (
        <ModalOverlay onClose={closeEdit}>
          <GlassTypeForm
            glassType={glassType}
            categoriesList={categoriesList}
            onClose={closeEdit}
          />
        </ModalOverlay>
      )}

      {isConfirmOpen && (
        <ModalOverlay onClose={closeConfirm}>
          <ConfirmContainer
            text={`Do you really want to delete glass type ${glassType.label}?`}
            onConfirm={handleDelete}
            onClose={closeConfirm}
          />
        </ModalOverlay>
      )}
    </>
  );
}

export default GlassTypeRow;
