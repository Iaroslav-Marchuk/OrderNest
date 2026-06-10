import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Client } from '../../types/client';
import css from './ClientRow.module.css';
import { deleteClientApi } from '../../services/clientsApi';
import toast from 'react-hot-toast';
import { useState } from 'react';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import ClientForm from '../ClientForm/ClientForm';
import { Pencil, Trash2 } from 'lucide-react';

interface ClientRowProps {
  client: Client;
  index: number;
}

function ClientRow({ client, index }: ClientRowProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteClient } = useMutation({
    mutationFn: deleteClientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClients'] });
      toast.success('Client deleted successfully!');
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
    deleteClient(client._id);
    closeConfirm();
  };

  const createdAt = new Date(client.createdAt).toLocaleString('en-GB', {
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
        <td className={css.td}>{client.name}</td>
        <td className={css.td}>{createdAt}</td>
        <td className={css.td}>
          <div className={css.actions}>
            <button className={css.btn} onClick={openEdit}>
              <Pencil size={16} strokeWidth={1.5} />
            </button>
            <button className={css.btnDelete} onClick={openConfirm}>
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        </td>
      </tr>

      {isEditOpen && (
        <ModalOverlay onClose={closeEdit}>
          <ClientForm client={client} onClose={closeEdit} />
        </ModalOverlay>
      )}

      {isConfirmOpen && (
        <ModalOverlay onClose={closeConfirm}>
          <ConfirmContainer
            text={`Do you really want to delete client ${client.name}?`}
            onConfirm={handleDelete}
            onClose={closeConfirm}
          />
        </ModalOverlay>
      )}
    </>
  );
}

export default ClientRow;
