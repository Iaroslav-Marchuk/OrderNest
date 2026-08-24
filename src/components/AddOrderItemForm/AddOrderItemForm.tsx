import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { PulseLoader } from 'react-spinners';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AxiosError } from 'axios';

import { useAllGlassCategories } from '../../hooks/useAllGlassCategories';
import { useAllGlassTypes } from '../../hooks/useAllGlassTypes';

import { addItemToOrderApi } from '../../services/ordersApi';

import OrderItemForm from '../OrderItemForm/OrderItemForm';

import css from './AddOrderItemForm.module.css';

interface AddOrderItemFormProps {
  orderId: string;
  onClose: () => void;
}

const itemSchema = Yup.object().shape({
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
  quantity: Yup.number().integer().positive().min(1).required('Required field'),
  reason: Yup.string().max(100).required('Required field'),
  notes: Yup.string().max(100),
});

const validationSchema = Yup.object().shape({
  items: Yup.array().of(itemSchema),
});

const initialValues = {
  items: [
    {
      type: '',
      thickness: '',
      sizeX: '' as number | '',
      sizeY: '' as number | '',
      isTempered: false,
      quantity: 1,
      reason: '',
      notes: '',
    },
  ],
};

function AddOrderItemForm({ orderId, onClose }: AddOrderItemFormProps) {
  const queryClient = useQueryClient();
  const { allGlassCategories } = useAllGlassCategories();
  const { allGlassTypes } = useAllGlassTypes();

  const { mutate: addOrderItem, isPending } = useMutation({
    mutationFn: addItemToOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderItems', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Item added successfully!');
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const handleSubmit = (values: typeof initialValues) => {
    addOrderItem({ orderId, itemData: values.items[0] });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <OrderItemForm
          index={0}
          canRemove={false}
          onRemove={() => {}}
          isPending={isPending}
          categoriesList={allGlassCategories}
          typesList={allGlassTypes}
        />
        <button type="submit" className={css.submitBtn} disabled={isPending}>
          {isPending ? <PulseLoader color="#9fb9e2ff" size={5} /> : 'Add Item'}
        </button>
      </Form>
    </Formik>
  );
}

export default AddOrderItemForm;
