// import * as Yup from 'yup';

// import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';

// import css from './OrderForm.module.css';
// import OrderItemForm from '../OrderItemForm/OrderItemForm';
// import { useMutation, useQueryClient } from '@tanstack/react-query';

// import type {
//   Order,
//   OrderExistsResponse,
//   OrderFormValues,
//   OrderItemFormValues,
// } from '../../types/order';
// import { useAllClients } from '../../hooks/useAllClients';
// import { useAllGlassCategories } from '../../hooks/useAllGlassCategories';
// import { useAllGlassTypes } from '../../hooks/useAllGlassTypes';
// import { checkOrderExistsApi, createOrderApi } from '../../services/ordersApi';
// import { useCurrentUser } from '../../hooks/useCurrentUser';
// import { PulseLoader } from 'react-spinners';
// import toast from 'react-hot-toast';
// import type { AxiosError } from 'axios';
// import { useState } from 'react';
// import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
// import ModalOverlay from '../ModalOverlay/ModalOverlay';

// interface OrderFormProps {
//   onClose: () => void;
// }

// type DuplicateOrder = NonNullable<OrderExistsResponse['orders']>[number];

// const STATUS_LABEL: Record<Order['status'], string> = {
//   created: 'Created',
//   in_progress: 'In Progress',
//   completed: 'Completed',
// };

// const validationSchema = Yup.object().shape({
//   ep: Yup.number()
//     .integer()
//     .positive()
//     .min(1)
//     .max(20000)
//     .required('Required field'),
//   client: Yup.string().required('Required field'),
//   items: Yup.array().of(
//     Yup.object().shape({
//       type: Yup.string().required('Required field'),
//       thickness: Yup.string().required('Required field'),
//       sizeX: Yup.number()
//         .integer()
//         .positive()
//         .min(1)
//         .max(6000)
//         .required('Required field'),
//       sizeY: Yup.number()
//         .integer()
//         .positive()
//         .min(1)
//         .max(6000)
//         .required('Required field'),
//       isTempered: Yup.boolean(),
//       quantity: Yup.number()
//         .integer()
//         .positive()
//         .min(1)
//         .required('Required field'),
//       reason: Yup.string().max(100).required('Required field'),
//       notes: Yup.string().max(100),
//     })
//   ),
// });

// const emptyItem: OrderItemFormValues = {
//   type: '',
//   sizeX: '' as number | '',
//   sizeY: '' as number | '',
//   thickness: '',
//   isTempered: false,
//   quantity: 1,
//   reason: '',
//   notes: '',
// };

// const initialValues: OrderFormValues = {
//   ep: '' as number | '',
//   client: '',
//   items: [emptyItem],
// };

// function OrderForm({ onClose }: OrderFormProps) {
//   const queryClient = useQueryClient();
//   const { allClients } = useAllClients();
//   const { allGlassCategories } = useAllGlassCategories();
//   const { allGlassTypes } = useAllGlassTypes();
//   const { currentUser, location } = useCurrentUser();

//   const { mutate: createOrder, isPending } = useMutation({
//     mutationFn: createOrderApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['orders'] });
//       toast.success('Successfully added new order!');
//       onClose();
//     },
//     onError: (error: AxiosError<{ message: string }>) => {
//       const message = error.response?.data?.message;
//       toast.error(message ?? 'Something went wrong!');
//     },
//   });

//   const handleSubmit = (values: OrderFormValues) => {
//     createOrder(values);
//   };

//   const [duplicateOrders, setDuplicateOrders] = useState<
//     DuplicateOrder[] | null
//   >(null);

//   const { mutate: checkEp } = useMutation({
//     mutationFn: checkOrderExistsApi,
//     onSuccess: data => {
//       setDuplicateOrders(data.exists && data.orders ? data.orders : null);
//     },
//   });

//   const handleEpBlur = (ep: number | '') => {
//     if (!ep) {
//       setDuplicateOrders(null);
//       return;
//     }
//     checkEp(ep);
//   };

//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   const openConfirm = () => setIsConfirmOpen(true);
//   const closeConfirm = () => setIsConfirmOpen(false);

//   const LOCATION_LABEL: Record<Order['location'], string> = {
//     line_1: 'Line 1',
//     line_2: 'Line 2',
//     line_3: 'Line 3',
//   };

//   return (
//     <>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ values, handleBlur }) => (
//           <Form className={css.form}>
//             <fieldset className={css.fieldset}>
//               <legend>Order Info</legend>
//               <div className={css.infoWrapper}>
//                 <div className={css.formGroup}>
//                   <label className={css.label}>Location</label>
//                   <span className={css.value}>
//                     {location
//                       ? LOCATION_LABEL[location as Order['location']]
//                       : '—'}
//                   </span>
//                 </div>
//                 <div className={css.formGroup}>
//                   <label className={css.label}>Responsible</label>
//                   <span className={css.value}>{currentUser?.name}</span>
//                 </div>
//               </div>

//               <div className={css.infoWrapper}>
//                 <div className={css.formGroup}>
//                   <label htmlFor="ep" className={css.label}>
//                     EP
//                   </label>
//                   <Field
//                     type="number"
//                     name="ep"
//                     id="ep"
//                     className={css.input}
//                     disabled={isPending}
//                     onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
//                       openConfirm();
//                       handleBlur(e);
//                       handleEpBlur(values.ep);
//                     }}
//                   />
//                   <ErrorMessage
//                     name="ep"
//                     component="span"
//                     className={css.error}
//                   />
//                 </div>

//                 <div className={css.formGroup}>
//                   <label htmlFor="client" className={css.label}>
//                     Client
//                   </label>

//                   <Field
//                     as="select"
//                     name="client"
//                     id="client"
//                     className={css.input}
//                     disabled={isPending}
//                   >
//                     <option value="">Select client...</option>
//                     {allClients.map(client => (
//                       <option key={client._id} value={client._id}>
//                         {client.name}
//                       </option>
//                     ))}
//                   </Field>

//                   <ErrorMessage
//                     name="client"
//                     component="span"
//                     className={css.error}
//                   />
//                 </div>
//               </div>
//             </fieldset>

//             <fieldset className={css.fieldset}>
//               <legend>Item Info</legend>
//               <FieldArray name="items">
//                 {({ push, remove, form }) => (
//                   <>
//                     {form.values.items.map(
//                       (_: OrderItemFormValues, index: number) => (
//                         <OrderItemForm
//                           key={index}
//                           index={index}
//                           onRemove={() => remove(index)}
//                           canRemove={form.values.items.length > 1}
//                           isPending={isPending}
//                           categoriesList={allGlassCategories}
//                           typesList={allGlassTypes}
//                         />
//                       )
//                     )}
//                     <button
//                       type="button"
//                       className={css.addBtn}
//                       onClick={() => push(emptyItem)}
//                     >
//                       Add new Item
//                     </button>
//                   </>
//                 )}
//               </FieldArray>
//             </fieldset>
//             <button
//               type="submit"
//               className={css.submitBtn}
//               disabled={isPending}
//             >
//               {isPending ? (
//                 <PulseLoader color="#9fb9e2ff" size={5} />
//               ) : (
//                 'Create Order'
//               )}
//             </button>
//           </Form>
//         )}
//       </Formik>

//       {isConfirmOpen && (
//         <ModalOverlay onClose={closeConfirm}>
//           <ConfirmContainer
//             text={`Do you really want to leave?`}
//             onConfirm={logout}
//             onClose={closeConfirm}
//           />
//         </ModalOverlay>
//       )}

//       {/* {duplicateOrders && duplicateOrders.length > 0 && (
//         <ConfirmContainer>
//           <div className={css.duplicateWarning}>
//             <p>
//               Order EP-{values.ep} already exists ({duplicateOrders.length}):
//             </p>
//             <ul>
//               {duplicateOrders.map(order => (
//                 <li key={order._id}>
//                   {order.owner?.name ?? '—'} —{' '}
//                   {new Date(order.createdAt).toLocaleDateString('en-GB')} —{' '}
//                   {STATUS_LABEL[order.status]}
//                 </li>
//               ))}
//             </ul>
//             <p>You can still create a new order with this EP.</p>
//           </div>
//         </ConfirmContainer>
//       )} */}
//     </>
//   );
// }

// export default OrderForm;

import * as Yup from 'yup';

import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';

import css from './OrderForm.module.css';
import OrderItemForm from '../OrderItemForm/OrderItemForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  Order,
  OrderExistsResponse,
  OrderFormValues,
  OrderItemFormValues,
} from '../../types/order';
import { useAllClients } from '../../hooks/useAllClients';
import { useAllGlassCategories } from '../../hooks/useAllGlassCategories';
import { useAllGlassTypes } from '../../hooks/useAllGlassTypes';
import { checkOrderExistsApi, createOrderApi } from '../../services/ordersApi';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { PulseLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import ConfirmContainer from '../ConfirmContainer/ConfirmContainer';
import ModalOverlay from '../ModalOverlay/ModalOverlay';

interface OrderFormProps {
  onClose: () => void;
}

type DuplicateOrder = NonNullable<OrderExistsResponse['orders']>[number];

const STATUS_LABEL: Record<Order['status'], string> = {
  created: 'Created',
  in_progress: 'In Progress',
  completed: 'Completed',
};

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

function buildDuplicateText(ep: number | '', orders: DuplicateOrder[]) {
  const lines = orders.map(
    order =>
      `${order.owner?.name ?? '—'} (${new Date(order.createdAt).toLocaleDateString('en-GB')}, ${STATUS_LABEL[order.status]})`
  );
  return `Order EP-${ep} already exists (${orders.length}): ${lines.join('; ')}. Continue creating a new one with this EP?`;
}

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

  const [duplicateOrders, setDuplicateOrders] = useState<
    DuplicateOrder[] | null
  >(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingEp, setPendingEp] = useState<number | ''>('');

  const { mutate: checkEp } = useMutation({
    mutationFn: checkOrderExistsApi,
    onSuccess: data => {
      if (data.exists && data.orders) {
        (document.activeElement as HTMLElement)?.blur();
        setDuplicateOrders(data.orders);
        setIsConfirmOpen(true);
      } else {
        setDuplicateOrders(null);
      }
    },
  });

  const handleEpBlur = (ep: number | '') => {
    if (!ep) {
      setDuplicateOrders(null);
      return;
    }
    setPendingEp(ep);
    checkEp(ep);
  };

  const closeConfirm = () => setIsConfirmOpen(false);

  const LOCATION_LABEL: Record<Order['location'], string> = {
    line_1: 'Line 1',
    line_2: 'Line 2',
    line_3: 'Line 3',
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleBlur, setFieldValue }) => (
          <>
            <Form className={css.form}>
              <fieldset className={css.fieldset}>
                <legend>Order Info</legend>
                <div className={css.infoWrapper}>
                  <div className={css.formGroup}>
                    <label className={css.label}>Location</label>
                    <span className={css.value}>
                      {location
                        ? LOCATION_LABEL[location as Order['location']]
                        : '—'}
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
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        handleBlur(e);
                        handleEpBlur(values.ep);
                      }}
                    />
                    <ErrorMessage
                      name="ep"
                      component="span"
                      className={css.error}
                    />
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
              <button
                type="submit"
                className={css.submitBtn}
                disabled={isPending}
              >
                {isPending ? (
                  <PulseLoader color="#9fb9e2ff" size={5} />
                ) : (
                  'Create Order'
                )}
              </button>
            </Form>

            {isConfirmOpen && duplicateOrders && (
              <ModalOverlay onClose={closeConfirm}>
                <ConfirmContainer
                  text={buildDuplicateText(pendingEp, duplicateOrders)}
                  onConfirm={closeConfirm}
                  onClose={() => {
                    setFieldValue('ep', '');
                    setDuplicateOrders(null);
                    closeConfirm();
                  }}
                />
              </ModalOverlay>
            )}
          </>
        )}
      </Formik>
    </>
  );
}

export default OrderForm;
