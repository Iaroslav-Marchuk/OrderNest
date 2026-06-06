import * as Yup from 'yup';
import type { CreateUserReq, User } from '../../types/user';
import css from './UserForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserApi, patchUserApi } from '../../services/usersApi';
import toast from 'react-hot-toast';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { PulseLoader } from 'react-spinners';

import { KeyRound, Phone, User as UserIcon } from 'lucide-react';

interface UserFormProps {
  onClose: () => void;
  user?: User;
}

const createValidationSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  tel: Yup.string().required('Required field'),
  role: Yup.string()
    .oneOf([
      'cutting',
      'hardening',
      'assembly',
      'quality',
      'logistics',
      'guest',
    ])
    .required('Required field'),
  password: Yup.string().required('Required field'),
});

const editValidationSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  tel: Yup.string().required('Required field'),
  role: Yup.string()
    .oneOf([
      'cutting',
      'hardening',
      'assembly',
      'quality',
      'logistics',
      'guest',
    ])
    .required('Required field'),
});

function UserForm({ onClose, user }: UserFormProps) {
  const queryClient = useQueryClient();

  const createInitialValues: CreateUserReq = {
    name: '',
    tel: '',
    role: 'guest',
    password: '',
  };

  const editInitialValues = {
    name: user?.name ?? '',
    tel: user?.tel ?? '',
    role: user?.role ?? 'guest',
  };

  const validationSchema = user ? editValidationSchema : createValidationSchema;
  const initialValues = user ? editInitialValues : createInitialValues;

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      toast.success('Successfully added new user!');
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

  const handleSubmit = (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    if (user) {
      patchUser({ userId: user._id, updateData: values });
    } else {
      createUser(values as CreateUserReq);
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
              User's name
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
              <UserIcon className={css.inputIcon} size={24} strokeWidth={1.5} />
            </div>
            <ErrorMessage name="name" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tel" className={css.label}>
              Telephone number
            </label>
            <div className={css.inputContainer}>
              <Field
                type="tel"
                name="tel"
                id="tel"
                placeholder=" "
                autoComplete="tel"
                className={css.input}
                disabled={isPending}
              />
              <Phone className={css.inputIcon} size={24} strokeWidth={1.5} />
            </div>
            <ErrorMessage name="tel" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="role" className={css.label}>
              User's role
            </label>
            <div className={css.inputContainer}>
              <Field as="select" name="role" id="role" className={css.input}>
                <option value="guest">Guest</option>
                <option value="cutting">Cutting</option>
                <option value="hardening">Hardening</option>
                <option value="assembly">Assembly</option>
                <option value="quality">Quality</option>
                <option value="logistics">Logistics</option>
              </Field>
            </div>
            <ErrorMessage name="role" component="span" className={css.error} />
          </div>

          {!user && (
            <div className={css.formGroup}>
              <label htmlFor="password" className={css.label}>
                Password
              </label>
              <div className={css.inputContainer}>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder=" "
                  autoComplete="current-password"
                  className={css.input}
                  disabled={isPending}
                />
                <KeyRound
                  className={css.inputIcon}
                  size={24}
                  strokeWidth={1.5}
                />
              </div>
              <ErrorMessage
                name="password"
                component="span"
                className={css.error}
              />
            </div>
          )}

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
            ) : user ? (
              'Update User'
            ) : (
              'Create User'
            )}
          </button>
        </Form>
      </Formik>
    </>
  );
}

export default UserForm;
