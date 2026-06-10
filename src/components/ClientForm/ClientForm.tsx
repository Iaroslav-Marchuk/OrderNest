import * as Yup from 'yup';

import type { Client } from '../../types/client';
import css from './ClientForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNewClientApi, patchClientApi } from '../../services/clientsApi';
import toast from 'react-hot-toast';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { PulseLoader } from 'react-spinners';

interface ClientFormProps {
  onClose: () => void;
  client?: Client;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
});

function ClientForm({ onClose, client }: ClientFormProps) {
  const queryClient = useQueryClient();

  const createInitialValues = {
    name: '',
  };

  const editInitialValues = {
    name: client?.name ?? '',
  };

  const initialValues = client ? editInitialValues : createInitialValues;

  const { mutate: addNewClient, isPending } = useMutation({
    mutationFn: addNewClientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClients'] });
      toast.success('Successfully added new client!');
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const { mutate: patchClient } = useMutation({
    mutationFn: patchClientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allClients'] });
      toast.success('Client updated successfully!');
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const handleSubmit = (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    if (client) {
      patchClient({
        clientId: client._id,
        updateData: { name: values.name },
      });
    } else {
      addNewClient(values.name);
    }
    actions.resetForm();
    onClose();
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
