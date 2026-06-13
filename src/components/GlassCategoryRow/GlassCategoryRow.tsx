import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GlassCategory } from '../../types/glassCategory';
import css from './GlassCategoryRow.module.css';
import { deleteGlassCategoryApi } from '../../services/glassCategoriesApi';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import GlassCategoryForm from '../GlassCategoryForm/GlassCategoryForm';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';

interface GlassCategoryRow {
  glassCategory: GlassCategory;
  index: number;
}

function GlassCategoryRow({ glassCategory, index }: GlassCategoryRow) {
  const queryClient = useQueryClient();

  const { mutate: deleteGlassCategory } = useMutation({
    mutationFn: deleteGlassCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGlassCategories'] });
      toast.success('Glass category deleted successfully!');
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
    deleteGlassCategory(glassCategory._id);
    closeConfirm();
  };

  const createdAt = new Date(glassCategory.createdAt).toLocaleString('en-GB', {
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
        <td className={css.td}>{glassCategory.label}</td>
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
          <GlassCategoryForm
            glassCategory={glassCategory}
            onClose={closeEdit}
          />
        </ModalOverlay>
      )}

      {isConfirmOpen && (
        <ModalOverlay onClose={closeConfirm}>
          <ConfirmContainer
            text={`Do you really want to delete glass category ${glassCategory.label}?`}
            onConfirm={handleDelete}
            onClose={closeConfirm}
          />
        </ModalOverlay>
      )}
    </>
  );
}

export default GlassCategoryRow;
