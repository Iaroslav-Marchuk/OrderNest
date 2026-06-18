import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GlassCategory } from '../../types/glassCategory';
import css from './GlassCategoryRow.module.css';
import { deleteGlassCategoryApi } from '../../services/glassCategoriesApi';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import GlassCategoryForm from '../GlassCategoryForm/GlassCategoryForm';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import type { AxiosError } from 'axios';

interface GlassCategoryRowProps {
  glassCategory: GlassCategory;
  index: number;
}

function GlassCategoryRow({ glassCategory, index }: GlassCategoryRowProps) {
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const openEdit = () => setIsEditOpen(true);
  const closeEdit = () => setIsEditOpen(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const openConfirm = () => setIsConfirmOpen(true);
  const closeConfirm = () => setIsConfirmOpen(false);

  const [isAccOpen, setIsAccOpen] = useState(false);

  const { mutate: deleteGlassCategory } = useMutation({
    mutationFn: deleteGlassCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allGlassCategories'] });
      toast.success('Glass category deleted successfully!');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const linkedTypes = glassCategory.glassTypes ?? [];

  const handleDelete = () => {
    deleteGlassCategory(glassCategory._id);
    closeConfirm();
  };

  const handleRowClick = () => setIsAccOpen(prev => !prev);

  const createdAt = new Date(glassCategory.createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <tr className={css.row} onClick={handleRowClick}>
        <td className={css.td}>{index}</td>
        <td className={css.td}>
          <span className={css.labelWithIcon}>
            {isAccOpen ? (
              <ChevronUp size={14} strokeWidth={1.5} />
            ) : (
              <ChevronDown size={14} strokeWidth={1.5} />
            )}
            {glassCategory.label}
          </span>
        </td>
        <td className={css.td}>{createdAt}</td>
        <td className={css.td}>
          <div className={css.actions}>
            <button
              className={css.btn}
              onClick={e => {
                e.stopPropagation();
                openEdit();
              }}
              title="Edit"
            >
              <Pencil size={16} strokeWidth={1.5} />
            </button>
            <button
              className={css.btnDelete}
              onClick={e => {
                e.stopPropagation();
                openConfirm();
              }}
              title="Delete"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        </td>
      </tr>

      {isAccOpen && (
        <tr className={css.accordionRow}>
          <td colSpan={4} className={css.accordionCell}>
            <div className={css.accordionContent}>
              {linkedTypes.length === 0 ? (
                <p className={css.accordionEmpty}>
                  No glass types in this category
                </p>
              ) : (
                <ul className={css.accordionList}>
                  {linkedTypes.map(gt => (
                    <li key={gt._id} className={css.accordionItem}>
                      {gt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </td>
        </tr>
      )}

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
