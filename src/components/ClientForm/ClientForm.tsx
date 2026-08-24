import * as Yup from 'yup';
import type { AxiosError } from 'axios';
import { PulseLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Client, ClientFormValues } from '../../types/client';

import { addNewClientApi, patchClientApi } from '../../services/clientsApi';

import css from './ClientForm.module.css';

interface ClientFormProps {
  onClose: () => void;
  client?: Client;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Minimum 3 characters').required('Required field'),
});

function ClientForm({ onClose, client }: ClientFormProps) {
  const queryClient = useQueryClient();

  const initialValues: ClientFormValues = {
    name: client?.name ?? '',
  };

  const { mutate: addNewClient, isPending } = useMutation({
    mutationFn: addNewClientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Successfully added new client!');
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const { mutate: patchClient } = useMutation({
    mutationFn: patchClientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client updated successfully!');
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const handleSubmit = (values: ClientFormValues) => {
    if (client) {
      patchClient({ clientId: client._id, updateData: { name: values.name } });
    } else {
      addNewClient(values.name);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="name" className={css.label}>
              Client's name
            </label>
            <div className={css.inputContainer}>
              <Field
                type="text"
                name="name"
                id="name"
                placeholder=" "
                autoComplete="name"
                className={css.input}
                disabled={isPending}
              />
            </div>
            <ErrorMessage name="name" component="span" className={css.error} />
          </div>

          <button type="submit" className={css.btn} disabled={isPending}>
            {isPending ? (
              <PulseLoader
                loading={true}
                aria-label="Loading Spinner"
                data-testid="loader"
                color="#9fb9e2ff"
                size={5}
                className={css.spiner}
              />
            ) : client ? (
              'Update Client'
            ) : (
              'Add new Client'
            )}
          </button>
        </Form>
      </Formik>
    </>
  );
}

export default ClientForm;
