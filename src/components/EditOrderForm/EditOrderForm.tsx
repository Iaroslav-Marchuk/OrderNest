import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import css from './EditOrderForm.module.css';
import { useAllClients } from '../../hooks/useAllClients';
import type { Order } from '../../types/order';
import { patchOrderApi } from '../../services/ordersApi';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { PulseLoader } from 'react-spinners';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { formatLocation } from '../../utils/formatLocationLabel';

interface EditOrderFormProps {
  order: Order;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  ep: Yup.number().integer().positive().min(1).max(20000),
  client: Yup.string(),
});

function EditOrderForm({ onClose, order }: EditOrderFormProps) {
  const queryClient = useQueryClient();
  const { allClients } = useAllClients();
  const { currentUser, location } = useCurrentUser();

  const initialValues = {
    ep: order?.ep,
    client: order.client._id,
  };

  const { mutate: patchOrder, isPending } = useMutation({
    mutationFn: patchOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order updated successfully!');
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const handleEdit = (values: typeof initialValues) => {
    patchOrder({ orderId: order._id, updateData: values });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleEdit}
    >
      <Form className={css.form}>
        <fieldset className={css.fieldset}>
          <legend>Order Info</legend>
          <div className={css.infoWrapper}>
            <div className={css.formGroup}>
              <label className={css.label}>Location</label>
              <span className={css.value}>
                {' '}
                {location ? formatLocation(location) : '—'}
              </span>
            </div>
            <div className={css.formGroup}>
              <label className={css.label}>Responsible</label>
              <span className={css.value}>{currentUser?.name}</span>
            </div>
          </div>

          <div className={css.infoWrapper}>
            <div className={css.formGroup}>
              <label htmlFor="ep" className={css.label}>
                EP
              </label>
              <Field
                type="number"
                name="ep"
                id="ep"
                className={css.input}
                disabled={isPending}
              />
              <ErrorMessage name="ep" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="client" className={css.label}>
                Client
              </label>

              <Field
                as="select"
                name="client"
                id="client"
                className={css.input}
                disabled={isPending}
              >
                <option value="">Select client...</option>
                {allClients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </Field>

              <ErrorMessage
                name="client"
                component="span"
                className={css.error}
              />
            </div>
          </div>
        </fieldset>
        <button type="submit" className={css.submitBtn} disabled={isPending}>
          {isPending ? (
            <PulseLoader color="#9fb9e2ff" size={5} />
          ) : (
            'Update Order'
          )}
        </button>
      </Form>
    </Formik>
  );
}

export default EditOrderForm;
