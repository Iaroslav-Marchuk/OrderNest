import * as Yup from 'yup';

import type { OrderItem } from '../../types/order';

import css from './EditOrderItemForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAllGlassCategories } from '../../hooks/useAllGlassCategories';
import { useAllGlassTypes } from '../../hooks/useAllGlassTypes';
import { patchOrderItemApi } from '../../services/ordersApi';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { PulseLoader } from 'react-spinners';
import OrderItemForm from '../OrderItemForm/OrderItemForm';

interface EditOrderItemFormProps {
  item: OrderItem;
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

function EditOrderItemForm({ item, orderId, onClose }: EditOrderItemFormProps) {
  const queryClient = useQueryClient();
  const { allGlassCategories } = useAllGlassCategories();
  const { allGlassTypes } = useAllGlassTypes();

  const initialValues = {
    items: [
      {
        type: item.type._id,
        thickness: item.thickness,
        sizeX: item.sizeX,
        sizeY: item.sizeY,
        isTempered: item.isTempered,
        quantity: item.quantity,
        reason: item.reason,
        notes: item.notes,
      },
    ],
  };

  const { mutate: patchOrderItem, isPending } = useMutation({
    mutationFn: patchOrderItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderItems', orderId] });
      toast.success('Order item updated successfully!');
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error.response?.data?.message;
      toast.error(message ?? 'Something went wrong!');
    },
  });

  const handleEdit = (values: typeof initialValues) => {
    patchOrderItem({ orderId, itemId: item._id, updateData: values.items[0] });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleEdit}
    >
      {() => (
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
            {isPending ? (
              <PulseLoader color="#9fb9e2ff" size={5} />
            ) : (
              'Update Item'
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default EditOrderItemForm;
