import * as Yup from 'yup';

import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';

import css from './OrderForm.module.css';
import OrderItemForm from '../OrderItemForm/OrderItemForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  Order,
  OrderFormValues,
  OrderItemFormValues,
} from '../../types/order';
import { useAllClients } from '../../hooks/useAllClients';
import { useAllGlassCategories } from '../../hooks/useAllGlassCategories';
import { useAllGlassTypes } from '../../hooks/useAllGlassTypes';
import { createOrderApi } from '../../services/ordersApi';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { PulseLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';

interface OrderFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  ep: Yup.number()
    .integer()
    .positive()
    .min(1)
    .max(20000)
    .required('Required field'),
  client: Yup.string().required('Required field'),
  items: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().required('Required field'),
      thickness: Yup.string().required('Required field'),
      sizeX: Yup.number()
        .integer()
        .positive()
        .min(1)
        .max(6000)
        .required('Required field'),
      sizeY: Yup.number()
        .integer()
        .positive()
        .min(1)
        .max(6000)
        .required('Required field'),
      isTempered: Yup.boolean(),
      quantity: Yup.number()
        .integer()
        .positive()
        .min(1)
        .required('Required field'),
      reason: Yup.string().max(100).required('Required field'),
      notes: Yup.string().max(100),
    })
  ),
});

const emptyItem: OrderItemFormValues = {
  type: '',
  sizeX: '' as number | '',
  sizeY: '' as number | '',
  thickness: '',
  isTempered: false,
  quantity: 1,
  reason: '',
  notes: '',
};

const initialValues: OrderFormValues = {
  ep: '' as number | '',
  client: '',
  items: [emptyItem],
};

function OrderForm({ onClose }: OrderFormProps) {
  const queryClient = useQueryClient();
  const { allClients } = useAllClients();
  const { allGlassCategories } = useAllGlassCategories();
  const { allGlassTypes } = useAllGlassTypes();
  const { currentUser, location } = useCurrentUser();

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Successfully added new order!');
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const handleSubmit = (values: OrderFormValues) => {
    createOrder(values);
  };

  const LOCATION_LABEL: Record<Order['location'], string> = {
    line_1: 'Line 1',
    line_2: 'Line 2',
    line_3: 'Line 3',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <fieldset className={css.fieldset}>
          <legend>Order Info</legend>
          <div className={css.infoWrapper}>
            <div className={css.formGroup}>
              <label className={css.label}>Location</label>
              <span className={css.value}>
                {location ? LOCATION_LABEL[location as Order['location']] : '—'}
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

        <fieldset className={css.fieldset}>
          <legend>Item Info</legend>
          <FieldArray name="items">
            {({ push, remove, form }) => (
              <>
                {form.values.items.map(
                  (_: OrderItemFormValues, index: number) => (
                    <OrderItemForm
                      key={index}
                      index={index}
                      onRemove={() => remove(index)}
                      canRemove={form.values.items.length > 1}
                      isPending={isPending}
                      categoriesList={allGlassCategories}
                      typesList={allGlassTypes}
                    />
                  )
                )}
                <button
                  type="button"
                  className={css.addBtn}
                  onClick={() => push(emptyItem)}
                >
                  Add new Item
                </button>
              </>
            )}
          </FieldArray>
        </fieldset>
        <button type="submit" className={css.submitBtn} disabled={isPending}>
          {isPending ? (
            <PulseLoader color="#9fb9e2ff" size={5} />
          ) : (
            'Create Order'
          )}
        </button>
      </Form>
    </Formik>
  );
}

export default OrderForm;
