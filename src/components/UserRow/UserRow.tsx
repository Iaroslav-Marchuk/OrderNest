import { Pencil, RotateCcwKey, Trash2 } from 'lucide-react';
import type { User } from '../../types/user';
import css from './UserRow.module.css';
import clsx from 'clsx';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserApi, patchUserApi } from '../../services/usersApi';
import UserForm from '../UserForm/UserForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';

interface UserRowProps {
  user: User;
  index: number;
}

function UserRow({ user, index }: UserRowProps) {
  const { name, tel, role, isActive, updatedAt } = user;

  const queryClient = useQueryClient();

  const { mutate: deleteUser } = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      toast.success('User deleted successfully!');
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const { mutate: patchUser } = useMutation({
    mutationFn: patchUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      toast.success('User updated successfully!');
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const handleToggleStatus = () => {
    patchUser({ userId: user._id, updateData: { isActive: !isActive } });
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const openEdit = () => setIsEditOpen(true);
  const closeEdit = () => setIsEditOpen(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const openConfirm = () => setIsConfirmOpen(true);
  const closeConfirm = () => setIsConfirmOpen(false);

  const [isResetPassOpen, setIsResetPassOpen] = useState(false);
  const openResetPass = () => setIsResetPassOpen(true);
  const closeResetPass = () => setIsResetPassOpen(false);

  const handleDelete = () => {
    deleteUser(user._id);
    closeConfirm();
  };

  const lastActivity = new Date(updatedAt).toLocaleString('en-GB', {
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
        <td className={css.td}>{name}</td>
        <td className={css.td}>{tel}</td>
        <td className={css.td}>{role}</td>
        <td className={css.td}>
          {role === 'admin' ? (
            <span className={css.status}>Active</span>
          ) : (
            <button
              className={clsx(css.status, !isActive && css.inactive)}
              onClick={handleToggleStatus}
            >
              {isActive ? 'Active' : 'Inactive'}
            </button>
          )}
        </td>
        <td className={css.td}>{lastActivity}</td>
        <td className={css.td}>
          {role !== 'admin' && (
            <div className={css.actions}>
              <button className={css.btn} onClick={openEdit}>
                <Pencil size={16} strokeWidth={1.5} />
              </button>
              <button className={css.btnDelete} onClick={openConfirm}>
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
              <button className={css.btn} onClick={openResetPass}>
                <RotateCcwKey size={16} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </td>
      </tr>

      {isEditOpen && (
        <ModalOverlay onClose={closeEdit}>
          <UserForm user={user} onClose={closeEdit} />
        </ModalOverlay>
      )}

      {isConfirmOpen && (
        <ModalOverlay onClose={closeConfirm}>
          <ConfirmContainer
            text={`Do you really want to delete user ${name}?`}
            onConfirm={handleDelete}
            onClose={closeConfirm}
          />
        </ModalOverlay>
      )}

      {isResetPassOpen && (
        <ModalOverlay onClose={closeResetPass}>
          <ResetPasswordForm userId={user._id} onClose={closeResetPass} />
        </ModalOverlay>
      )}
    </>
  );
}

export default UserRow;
